import React from 'react';
import {NavLink} from "react-router-dom";

const AdminNavBar = ({ openMenu, setOpenMenu }) => {

    const nav = [
        {
            name: 'Statistika',
            link: '/admin/dashboard'
        },
        {
            name: 'Arizachilar',
            link: '/admin/users'
        },
        {
            name: 'Talim tili',
            link: '/admin/edu-lang'
        },
        {
            name: 'Talim shakli',
            link: '/admin/edu-form'
        },
        {
            name: 'Talim yonalishi',
            link: '/admin/edu-dir'
        },
    ]


    return (
        <nav className={`nav ${openMenu ? 'open' : ''}`}>
            <ul className="nav__list">
                {
                    nav.map((item, i) => (
                        <li className="nav__item" onClick={() => setOpenMenu(false)} key={i}>
                            <NavLink className='nav__link row between align-center' to={item.link}>
                                <span>{ item.name }</span>
                                <i className="fa-solid fa-chevron-right icon"/>
                            </NavLink>
                        </li>
                    ))
                }
            </ul>
        </nav>
    );
};

export default AdminNavBar;