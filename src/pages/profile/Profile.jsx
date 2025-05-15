import './Profile.scss'
import React, {useState} from 'react';
import {Link} from "react-router-dom";
import logo from '../../assets/images/big-logo.svg'
import {Popconfirm, Steps} from "antd";
import MainC from "./content/MainC.jsx";
import ApplC from "./content/ApplC.jsx";
import DealC from "./content/DealC.jsx";
import CertC from "./content/CertC.jsx";

const Profile = () => {

    const [nav, setNav] = useState(0)

    const logout = () => {

    }


    return (
        <div className="profile">
            <div className="profile__header">
                <div className="container row between align-center">
                    <img src={logo} alt="logo"/>
                    <button className='btn row align-center g10' onClick={() => setNav(0)}>
                        <span>Abdusamad</span>
                        <i className="fa-solid fa-circle-user"/>
                    </button>
                </div>
            </div>
            <div className="profile__inner">
                <div className="container">
                    <div className="status">
                        <Steps
                            size="small"
                            current={1}
                            labelPlacement="vertical"
                            responsive={false}
                            items={[
                                {
                                    title: 'Ariza topshirildi',
                                    description: <button className='btn d-flex align-center g10'>
                                        <i className="fa-solid fa-download"/>
                                        <span>Qayd varaqa</span>
                                    </button>
                                },
                                {
                                    title: <span className='s-title'>Imtixon topshirilmagan</span>,
                                    description: <span className='s-title s-desc'>Imtixon vaqti: belgilanmagan</span>
                                },
                                {
                                    title: 'Shartnoma mavjud emas',
                                },
                            ]}
                        />
                    </div>
                    <div className="wrapper grid">
                        <div className="nav">
                            <ul className='nav__list'>
                                <li className={`item ${nav === 0 && 'active'}`} onClick={() => setNav(0)}>
                                    <i className="fa-solid fa-house"/>
                                    <span>Asosiy sahifa</span>
                                </li>
                                <li className={`item ${nav === 1 && 'active'}`} onClick={() => setNav(1)}>
                                    <i className="fa-solid fa-file-circle-check"/>
                                    <span>Mening arizam</span>
                                </li>
                                <li className={`item ${nav === 2 && 'active'}`} onClick={() => setNav(2)}>
                                    <i className="fa-solid fa-paste"/>
                                    <span>Mening shartnomam</span>
                                </li>
                                <li className={`item ${nav === 3 && 'active'}`} onClick={() => setNav(3)}>
                                    <i className="fa-solid fa-scroll"/>
                                    <span>Til sertifikatlari</span>
                                </li>

                                <Popconfirm
                                    title="Tizimdan chiqishni xoxlaysizmi?"
                                    onConfirm={logout}
                                    okText="Ha"
                                    cancelText="Yoq"
                                >
                                    <li className='item logout'>
                                        <i className="fa-solid fa-arrow-right-from-bracket"/>
                                        <span>Chiqish</span>
                                    </li>
                                </Popconfirm>
                            </ul>
                        </div>
                        <div className="content">
                            {nav === 0 && (
                                <MainC />
                            )}

                            {nav === 1 && (
                                <ApplC />
                            )}

                            {nav === 2 && (
                                <DealC />
                            )}

                            {nav === 3 && (
                                <CertC />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;