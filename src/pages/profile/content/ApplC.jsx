import React, {useEffect, useState} from 'react';
import geo from '../../../assets/images/geo.png'
import {Popconfirm} from "antd";
import {useTranslation} from "react-i18next";
import {useMutation} from "@tanstack/react-query";
import {$resp} from "../../../api/apiResp.js";
import i18n from "i18next";
import toast from "react-hot-toast";
import {Link} from "react-router-dom";

// fetch
const fetchRejectAppl = async () => {
    const { data } = await $resp.post("/admission/reject-my-admission")
    return data
}

const ApplC = ({ app, refetchApp, refetchMe }) => {

    const { t } = useTranslation()
    const rawLang = 'uz';
    const currentLang = rawLang.split('-')[0]

    const [copied, setCopied] = useState(false)
    const [rejectStatus, setRejectStatus] = useState(false)


    useEffect(() => {
        if (app?.data === null) {
            setRejectStatus(true)
        }
    }, [app])


    // reject appl
    const muReject = useMutation({
        mutationFn: fetchRejectAppl,
        onSuccess: (res) => {
            toast(res.message)
            setRejectStatus(true)

            refetchApp()
            refetchMe()
        },
        onError: (err) => {
            toast.error(`Ошибка: ${err.response?.data?.message || err.message}`)
        }
    })

    const rejectAppl = () => {
        muReject.mutate()
    }


    // copy
    const handleCopy = async (txt) => {
        try {
            await navigator.clipboard.writeText(txt)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500) // убираем "Скопировано" через 1.5 сек
        } catch (err) {
            console.error('Не удалось скопировать:', err)
        }
    }


    return (
        <div className="appl-c">
            <p className="content__title">{ t('Mening arizalarim') }</p>
            <div className="content__diver grid">
                {!rejectStatus ?
                    <>
                        <div className="app">
                            <div className='app__titles row between align-center g10'>
                                <p className="title">{ t('Ariza') } ID - { app?.data?.id }</p>
                                <p className={`desc ${app?.data?.status === 'pending' ? 'warn' : app?.data?.status === 'rejected' ? 'red' : ''}`}>
                                    { t('Status') }: <span>
                                    {t(
                                        app?.data?.status === 'accepted'
                                            ? 'Tasdiqlangan'
                                            : app?.data?.status === 'rejected'
                                                ? 'Bekor qilingan'
                                                : 'Kutilmoqda'
                                    )}
                                </span>
                                </p>
                            </div>
                            <div className="app__body">
                                <div className="title">{ t('Ariza malumotlari') }</div>
                                <ul className="check">
                                    <li className="check__item">
                                        <span className='txt'>{t('F.I.O')}</span>
                                        <span className='dots'/>
                                        <span className='txt font'>{ app?.data?.user.first_name + ' ' + app?.data?.user.last_name }</span>
                                    </li>
                                    <li className="check__item">
                                        <span className='txt'>{t('Talim shakli')}</span>
                                        <span className='dots'/>
                                        <span className='txt font'>{app?.data?.edu_form[`name_${currentLang}`]}</span>
                                    </li>
                                    <li className="check__item">
                                        <span className='txt'>{t('Talim tili')}</span>
                                        <span className='dots'/>
                                        <span className='txt font'>{app?.data?.edu_lang[`name_${currentLang}`]}</span>
                                    </li>
                                    <li className="check__item">
                                        <span className='txt'>{app?.data?.edu_form[`name_${currentLang}`]}</span>
                                        <span className='dots'/>
                                        <span className='txt font'>{app?.data?.edu_direction[`name_${currentLang}`]}</span>
                                    </li>
                                    <li className="check__item">
                                        <span className='txt'>{t('Bitrgan yili')}</span>
                                        <span className='dots'/>
                                        <span
                                            className='txt font'>{new Date(app?.data?.edu_end_date).getFullYear()}</span>
                                    </li>
                                    <li className="check__item">
                                        <span className='txt'>{t('Ariza sanasi')}</span>
                                        <span className='dots'/>
                                        <span className='txt font'>{new Date(app?.data?.created_at).toLocaleDateString()}</span>
                                    </li>
                                </ul>
                                <div className="row between">
                                    <span/>
                                    <Popconfirm
                                        title={t("Rostan ham arizani bekor qilmoxchimisiz?")}
                                        description={t('Arizani bekor qilishni tasdiqlaysizmi?')}
                                        onConfirm={rejectAppl}
                                        okText={ t('Ha') }
                                        cancelText={ t('Yoq') }
                                    >
                                        <button className='cancel'>{ t('Arizani bekor qilish') }</button>
                                    </Popconfirm>
                                </div>
                            </div>
                        </div>
                        <div className="geo">
                            <p className="title">{ t('OTM geolokatsiyasi') }</p>
                            <img src={geo} alt="img"/>
                            <button className='copy d-flex align-center g10' onClick={() => handleCopy('NMADR')}>
                                { !copied ? <i className="fa-regular fa-paste"/> : <i className="fa-solid fa-check"/> }
                                <span>{ t('Joylashuvni nusxalash') }</span>
                            </button>
                        </div>
                    </>
                    :
                    <Link class="again-btn" to='/login?count=3'>
                        <span>Ariza topshirish</span>
                    </Link>
                }
            </div>
        </div>
    );
};

export default ApplC;