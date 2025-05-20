import React, {useState} from 'react';
import geo from '../../../assets/images/geo.png'
import {Popconfirm} from "antd";
import {useTranslation} from "react-i18next";
import {useMutation, useQuery} from "@tanstack/react-query";
import {$resp} from "../../../api/apiResp.js";
import i18n from "i18next";
import toast from "react-hot-toast";
import {Link} from "react-router-dom";

// fetch
const fetchApp = async () => {
    const { data } = await $resp.get('/admission/my-admission')
    return data
}
const fetchRejectAppl = async () => {
    const { data } = await $resp.post("/admission/reject-my-admission")
    return data
}

const ApplC = () => {

    const { t } = useTranslation()
    const currentLang = i18n.language || 'uz'

    const [copied, setCopied] = useState(false)


    // fetch
    const { data: app } = useQuery({
        queryKey: ['app'],
        queryFn: fetchApp,
        keepPreviousData: true
    })


    // reject appl
    const muReject = useMutation({
        mutationFn: fetchRejectAppl,
        onSuccess: (res) => {
            toast(res.message)
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
                <div className="app">
                    <div className='app__titles row between align-center'>
                        <p className="title">{ t('Ariza') } ID - { app?.data?.id }</p>
                        <p className="desc">{ t('Status') }: <span>{ t('Tasdiqlangan') }</span></p>
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
                                    className='txt font'>{new Date(app?.data?.edu_end_date).toLocaleDateString()}</span>
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
            </div>
            <Link class="again-btn" to='/'>
                <span>Ariza topshirish</span>
            </Link>
        </div>
    );
};

export default ApplC;