"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

const OauthCallback: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    const insertOrFetchOAuthUser = async (oauthUser: any) => {
        try {
            const { data: existingUser, error: selectError } = await supabase
                .from('users')
                .select('*')
                .eq('email', oauthUser.email)
                .maybeSingle();

            if (selectError) throw new Error(selectError.message);

            if (!existingUser) {
                const { data: insertedUser, error: insertError } = await supabase
                    .from('users')
                    .insert([{ email: oauthUser.email, password_hash: null }])
                    .select()
                    .single();

                if (insertError) throw new Error(insertError.message);
                localStorage.setItem("userId", insertedUser.user_id);
            } else {
                localStorage.setItem("userId", existingUser.user_id);
            }

            localStorage.setItem("isLoggedIn", "true");
        } catch (err: any) {
            console.error("OAuth callback error:", err.message);
            setErrorMsg(err.message);
        }
    };

    useEffect(() => {
        const handleAuth = async () => {
            const {
                data: { session },
                error
            } = await supabase.auth.getSession();

            if (error || !session) {
                setErrorMsg("Could not get session from Supabase.");
                setLoading(false);
                return;
            }

            const user = session.user;
            if (!user?.email) {
                setErrorMsg("User email not available.");
                setLoading(false);
                return;
            }

            await insertOrFetchOAuthUser(user);
            navigate("/character-account");
        };

        handleAuth();
    }, [navigate]);

    return (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            {loading ? <h2>Finishing login...</h2> : null}
            {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
        </div>
    );
};

export default OauthCallback;
