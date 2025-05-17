import React, {useState} from 'react';
import geo from '../../../assets/images/geo.png'
import {Popconfirm} from "antd";
import {useTranslation} from "react-i18next";

const ApplC = () => {

    const { t } = useTranslation()

    const [copied, setCopied] = useState(false)

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
                        <p className="title">{ t('Ariza') } ID - 8888</p>
                        <p className="desc">{ t('Status') }: <span>{ t('Tasdiqlangan') }</span></p>
                    </div>
                    <div className="app__body">
                        <div className="title">{ t('Imtihon malumotlari') }</div>
                        <ul className="check">
                            <li className="check__item">
                                <span className='txt'>{ t('Manzil') }</span>
                                <span className='dots'/>
                                <span className='txt font'>Jasorat kochasi 43-uy</span>
                            </li>
                            <li className="check__item">
                                <span className='txt'>{ t('Sana') }</span>
                                <span className='dots'/>
                                <span className='txt font'>{ t('Imtixon vaqti hali belgilanmagan') }</span>
                            </li>
                            <li className="check__item">
                                <span className='txt'>{ t('Vaqt') }</span>
                                <span className='dots'/>
                                <span className='txt font'>{ t('Imtixon vaqti hali belgilanmagan') }</span>
                            </li>
                            <li className="check__item">
                                <span className='txt'>{ t('Fanlar') }</span>
                                <span className='dots'/>
                                <span className='txt font'>Fizika, Matematika</span>
                            </li>
                            <li className="check__item">
                                <span className='txt'>{ t('Izoh') }</span>
                                <span className='dots'/>
                            </li>
                        </ul>
                        <div className="row between">
                            <span/>
                            <Popconfirm
                                title={ t("Rostan ham arizani bekor qilmoxchimisiz?") }
                                description={ t('Arizani bekor qilishni tasdiqlaysizmi?') }
                                // onConfirm={confirm}
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
                    <button className='copy row align-center g10' onClick={() => handleCopy('NMADR')}>
                        { !copied ? <i className="fa-regular fa-paste"/> : <i className="fa-solid fa-check"/> }
                        <span>{ t('Joylashuvni nusxalash') }</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplC;