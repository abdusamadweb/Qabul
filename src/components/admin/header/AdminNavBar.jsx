import React from 'react';
import {NavLink} from "react-router-dom";

const AdminNavBar = ({ openMenu, setOpenMenu }) => {

    const me = JSON.parse(localStorage.getItem('meAdmin'))

    const nav = [
        {
            name: 'Statistika',
            link: '/admin/dashboard'
        },
        {
            name: 'Foydalanuvchilar',
            link: '/admin/users'
        },
        {
            name: 'Arizalar',
            link: '/admin/feeds'
        },
        {
            name: "Ta'lim shakli",
            link: '/admin/edu-form'
        },
        {
            name: "Ta'lim tili",
            link: '/admin/edu-lang'
        },
        {
            name: "Ta'lim yo'nalishi",
            link: '/admin/edu-dir'
        },
        {
            name: 'Qabul turi',
            link: '/admin/admission-type'
        },
    ]

    const navManager = [
        {
            name: 'Foydalanuvchilar',
            link: '/admin/users'
        },
        {
            name: 'Arizalar',
            link: '/admin/feeds'
        },
    ]

    const links =
        me?.role === 'admin' ? nav :
            me?.role === 'manager' ? navManager :
                [{
                    name: 'Statistika',
                    link: '/'
                }]


    return (
        <nav className={`nav ${openMenu ? 'open' : ''}`}>
            <ul className="nav__list">
                {
                    links.map((item, i) => (
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