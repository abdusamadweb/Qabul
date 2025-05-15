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
            <p className="content__title">Mening arizalarim</p>
            <div className="content__diver grid">
                <div className="app">
                    <div className='app__titles row between align-center'>
                        <p className="title">Ariza ID - 8888</p>
                        <p className="desc">Status: <span>Tasdiqlangan</span></p>
                    </div>
                    <div className="app__body">
                        <div className="title">Imtihon malumotlari</div>
                        <ul className="check">
                            <li className="check__item">
                                <span className='txt'>Manzil</span>
                                <span className='dots'/>
                                <span className='txt font'>Jasorat kochasi 43-uy</span>
                            </li>
                            <li className="check__item">
                                <span className='txt'>Sana</span>
                                <span className='dots'/>
                                <span className='txt font'>Imtixon vaqti hali belgilanmagan</span>
                            </li>
                            <li className="check__item">
                                <span className='txt'>Vaqt</span>
                                <span className='dots'/>
                                <span className='txt font'>Imtixon vaqti hali belgilanmagan</span>
                            </li>
                            <li className="check__item">
                                <span className='txt'>Fanlar</span>
                                <span className='dots'/>
                                <span className='txt font'>Fizika, Matematika</span>
                            </li>
                            <li className="check__item">
                                <span className='txt'>Izoh</span>
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
                                <button className='cancel'>Arizani bekor qilish</button>
                            </Popconfirm>
                        </div>
                    </div>
                </div>
                <div className="geo">
                    <p className="title">OTM geolokatsiyasi</p>
                    <img src={geo} alt="img"/>
                    <button className='copy row align-center g10' onClick={() => handleCopy('NMADR')}>
                        { !copied ? <i className="fa-regular fa-paste"/> : <i className="fa-solid fa-check"/> }
                        <span>Joylashuvni nusxalash</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplC;