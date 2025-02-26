import React from 'react';
import { Menubar } from 'primereact/menubar';

const NavBar: React.FC = () => {
    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            url: '/'
        },
        {
            label: 'About',
            icon: 'pi pi-info',
            url: '/about'
        },
        {
            label: 'Contact',
            icon: 'pi pi-envelope',
            url: '/contact'
        }
    ];

    return (
        <div>
            <Menubar model={items} />
        </div>
    );
};

export default NavBar;