import React from 'react';
import { Menubar } from 'primereact/menubar';
import {User} from '../context/GameContext';
import {Character } from '../context/GameContext';

//placeholder interface for user
interface UserMenuProps {
    user: User | null;
    logout: () => void;
    email: string;
    username: string;
    character: Character;

}
//same navbar, needs to be fleshed out when we know what the user object looks like
const NavBar: React.FC<UserMenuProps> = ({logout, username, character}) => {
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
        },
        {
            label: `${character.name}`,
            icon: (<img src={character.image}></img>),
        }
    ];

    return (
        <div>
            <Menubar model={items} />
        </div>
    );
};

export default NavBar;