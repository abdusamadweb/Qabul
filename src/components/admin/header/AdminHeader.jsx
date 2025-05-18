import './AdminHeader.scss'
import React, {useState} from 'react';
import {Link, useHref} from "react-router-dom";
import AdminNavBar from "./AdminNavBar.jsx";
import {hiddenRoutesAdmin, openRoutesAdmin} from "../../../assets/scripts/mockAPI.js";
import {Button, Modal} from "antd";
import {logout} from "../../../hooks/useCrud.jsx";

const AdminHeader = () => {

    const href = useHref({})
    const isHidden = hiddenRoutesAdmin.some(route => href.includes(route))
    const isOpen = openRoutesAdmin.some(route => href.includes(route))

    const [openMenu, setOpenMenu] = useState(false)
    const [modal, setModal] = useState(false)


    return (
        <div className={
            `admin-header ${openMenu ? 'open' : ''} ${isHidden ? 'd-none' : ''} ${isOpen ? 'd-block' : ''}`
        }>
            <div className="container row flex-column between">
                <div className="admin-header__inner">
                    <Link className='admin-header__logos' to='/admin/university'>
                        <h1 className={`admin-header__logo ${openMenu && 'opa'}`}>CRM</h1>
                    </Link>
                    <AdminNavBar openMenu={openMenu} setOpenMenu={setOpenMenu} />
                    <div className='burger-menu'>
                        <button onClick={() => setOpenMenu(true)}>
                            <i className={`fa-solid fa-bars-staggered icon ${openMenu ? 'close' : 'open'}`}/>
                        </button>
                        <button onClick={() => setOpenMenu(false)}>
                            <i className={`fa-solid fa-xmark icon ${openMenu ? 'open left' : 'close'}`}/>
                        </button>
                    </div>
                </div>
                <button className='log-out' onClick={() => setModal(true)}>
                    <i className="fa-solid fa-right-from-bracket"/>
                </button>
            </div>
            <Modal
                rootClassName='cancel-modal admin-cancel-modal'
                width='350px'
                open={modal}
                centered
                footer={false}
                onCancel={() => setModal(false)}
            >
                <p className="title">Chiqishga rozimisiz?</p>
                <div className="btns">
                    <button className='btn' onClick={() => setModal(false)}>Yoq</button>
                    <Button
                        className="btn red"
                        size="large"
                        onClick={logout}
                    >
                        Ha
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default AdminHeader;