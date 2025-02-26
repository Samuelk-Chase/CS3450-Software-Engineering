import React from 'react';
import { Menubar } from 'primereact/menubar';
import {User} from '../context/GameContext';

//placeholder interface for user
interface UserMenuProps {
    user: User | null;
    logout: () => void;
    email: string;
    username: string;

}
//same navbar, needs to be fleshed out when we know what the user object looks like
const NavBar: React.FC<UserMenuProps> = ({logout, username}) => {
    const items = [
        {
            label: `${username}`,
            icon: 'pi pi-user',
            items: [
                {
                    label: 'Logout',
                    icon: 'pi pi-power-off',
                    command: logout
                }
            ]
        }
    ];

    return (
        <div>
            <Menubar model={items} />
        </div>
    );
};

export default NavBar;