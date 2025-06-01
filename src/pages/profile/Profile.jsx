import './Profile.scss'
import React, {useEffect, useState} from 'react';
import logo from '../../assets/images/logo-dark.png'
import {Button, Dropdown, Popconfirm, Steps} from "antd";
import MainC from "./content/MainC.jsx";
import ApplC from "./content/ApplC.jsx";
import DealC from "./content/DealC.jsx";
import CertC from "./content/CertC.jsx";
import {useTranslation} from "react-i18next";
import {getRequest, logout} from "../../hooks/useCrud.jsx";
import ru from "../../assets/images/ru.png";
import us from "../../assets/images/us.png";
import uz from "../../assets/images/uz.png";
import {useQuery} from "@tanstack/react-query";
import {$resp} from "../../api/apiResp.js";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";


// fetch
const fetchApp = async () => {
    const { data } = await $resp.get('/admission/my-admission')
    return data
}
const downloadFile = async (id) => {
    try {
        const response = await $resp.get(`/admission/admission-request-file/${id}`, {
            responseType: 'blob',
        });

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `document-${id}.pdf`); // или любое имя файла
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Ошибка при скачивании PDF:', error);
        toast.error('PDF faylni yuklab bo‘lmadi');
    }
}


const Profile = () => {

    const navigate = useNavigate()

    const { t } = useTranslation()

    const [nav, setNav] = useState(0)
    const [status, setStatus] = useState(0)


    // fetch me
    const getMe = () => getRequest('/user/me')
    const { data: me, refetch: refetchMe } = useQuery({
        queryKey: ['me'],
        queryFn: getMe,
        keepPreviousData: true,
    })

    useEffect(() => {
        if (me) localStorage.setItem('me', JSON.stringify(me))
    }, [me])


    // fetch app
    const { data: app, refetch: refetchApp } = useQuery({
        queryKey: ['app'],
        queryFn: fetchApp,
        keepPreviousData: true
    })

    useEffect(() => {
        if (app) {
            if (app?.data === null) {
                setStatus(0)
            }
            else if (app?.data?.status === 'pending') {
                setStatus(1)
            }
            else if (app?.data?.status === 'accepted') {
                setStatus(2)
            }
        }
    }, [app])


    // lang
    const { i18n } = useTranslation()

    const langItems = [
        // {
        //     key: 'ru',
        //     label: (
        //         <button className='top-btn' onClick={() => i18n.changeLanguage('ru')}>
        //             <span>Russian</span>
        //             <img src={ru} alt="flag" />
        //         </button>
        //     ),
        // },
        // {
        //     key: 'en',
        //     label: (
        //         <button className='top-btn' onClick={() => i18n.changeLanguage('en')}>
        //             <span>English</span>
        //             <img src={us} alt="flag" />
        //         </button>
        //     ),
        // },
        {
            key: 'uz',
            label: (
                <button className='top-btn' onClick={() => i18n.changeLanguage('uz')}>
                    <span>Uzbek</span>
                    <img src={uz} alt="flag" />
                </button>
            ),
        },
    ]

    const languageMap = {
        // ru: { label: 'Russian', flag: ru },
        // en: { label: 'English', flag: us },
        uz: { label: 'Uzbek', flag: uz },
    }

    const rawLang = 'uz';
    const currentLang = rawLang.split('-')[0]


    // steps responsive
    const [labelPlacement, setLabelPlacement] = useState('horizontal');

    useEffect(() => {
        const handleResize = () => {
            const isSmall = window.innerWidth < 600;
            setLabelPlacement(!isSmall ? 'horizontal' : 'vertical');
        };

        handleResize(); // Boshlanishda chaqiramiz
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [])


    return (
        <div className="profile">
            <div className="profile__header">
                <div className="container row between align-center">
                    <img src={logo} alt="logo"/>
                    <div className="row align-center g1">
                        <Dropdown menu={{ items: langItems }} placement="bottomRight">
                            <Button className="lang-btn row align-center g10">
                                <span>{languageMap[currentLang]?.label}</span>
                                <img src={languageMap[currentLang]?.flag} alt="flag" />
                            </Button>
                        </Dropdown>
                        <button className='btn row align-center g10' onClick={() => setNav(0)}>
                            <span>{ me?.first_name }</span>
                            <i className="fa-solid fa-circle-user"/>
                        </button>
                    </div>
                </div>
            </div>
            <div className="profile__inner">
                <div className="container">
                    <div className="status">
                        <Steps
                            size="small"
                            current={status}
                            labelPlacement="vertical"
                            direction={labelPlacement}
                            responsive={false}
                            items={[
                                {
                                    title: t(app?.data === null ? 'Ariza topshirilmagan' : 'Ariza topshirildi'),
                                    description:
                                        <button className='btn d-flex align-center g10' onClick={() => app?.data ? downloadFile(me?.id) : navigate('/login?count=3')}>
                                            { app?.data && <i className="fa-solid fa-download"/> }
                                            <span>{ t(app?.data ? 'Qayd varaqa' : 'Ariza topshirish') }</span>
                                        </button>
                                },
                                {
                                    title: <span className='s-title'>{ t('Imtixon topshirilmagan') }</span>,
                                    description: <span className='s-title s-desc'>{ t('Imtixon vaqti:') } { t('belgilanmagan') }</span>
                                },
                                {
                                    title: t(app?.data?.status === 'accepted' ? '---' : 'Shartnoma mavjud emas'),
                                },
                            ]}
                        />
                    </div>
                    <div className="wrapper grid">
                        <div className="nav">
                            <ul className='nav__list'>
                                <li className={`item ${nav === 0 && 'active'}`} onClick={() => setNav(0)}>
                                    <i className="fa-solid fa-house"/>
                                    <span>{ t('Asosiy sahifa') }</span>
                                </li>
                                <li className={`item ${nav === 1 && 'active'}`} onClick={() => setNav(1)}>
                                    <i className="fa-solid fa-file-circle-check"/>
                                    <span>{ t('Mening arizam') }</span>
                                </li>
                                <li className={`item ${nav === 2 && 'active'}`} onClick={() => setNav(2)}>
                                    <i className="fa-solid fa-paste"/>
                                    <span>{ t('Mening shartnomam') }</span>
                                </li>
                                <li className={`item ${nav === 3 && 'active'}`} onClick={() => setNav(3)}>
                                    <i className="fa-solid fa-scroll"/>
                                    <span>{ t('Til sertifikatlari') }</span>
                                </li>

                                <Popconfirm
                                    title={ t('Tizimdan chiqishni xoxlaysizmi?') }
                                    onConfirm={logout}
                                    okText={ t('Ha') }
                                    cancelText={ t('Yoq') }
                                >
                                    <li className='item logout'>
                                        <i className="fa-solid fa-arrow-right-from-bracket"/>
                                        <span>{ t('Chiqish') }</span>
                                    </li>
                                </Popconfirm>
                            </ul>
                        </div>
                        <div className="content">
                            {nav === 0 && (
                                <MainC me={me} app={app} downloadFile={downloadFile} />
                            )}

                            {nav === 1 && (
                                <ApplC
                                    me={me}
                                    app={app}
                                    refetchApp={refetchApp}
                                    refetchMe={refetchMe}
                                />
                            )}

                            {nav === 2 && (
                                <DealC me={me} />
                            )}

                            {nav === 3 && (
                                <CertC me={me} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;