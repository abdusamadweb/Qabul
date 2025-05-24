import React from 'react';
import {useTranslation} from "react-i18next";
import {formatPhone} from "../../../assets/scripts/global.js";

// fetch

const MainC = ({ me, app, downloadFile }) => {

    const { t } = useTranslation()


    return (
        <div className="main-c">
            <p className="content__title">KUAF - { t('Xush kelibsiz!') }</p>
            <div className="content__diver">
                <p className="title">{ t('Shaxsiy malumotlar') }</p>
                <ul className='check'>
                    <li className="check__item">
                        <span className='txt'>{ t('F.I.O') }</span>
                        <span className='dots'/>
                        <span className='txt font'>{ me?.first_name ? (me?.first_name + ' ' + me?.last_name) : t('Yoq') }</span>
                    </li>
                    <li className="check__item">
                        <span className='txt'>{ t('Telefon raqam') }</span>
                        <span className='dots'/>
                        <span className='txt font'>{ formatPhone(me?.phone_number) }</span>
                    </li>
                    <li className="check__item">
                        <span className='txt'>{ t('JSHSHIR') }</span>
                        <span className='dots'/>
                        <span className='txt font'>{ me?.jshir || t('Yoq') }</span>
                    </li>
                    <li className="check__item">
                        <span className='txt'>{ t('Seriya va raqami') }</span>
                        <span className='dots'/>
                        <span className='txt font'>{ me?.passport_id || t('Yoq') }</span>
                    </li>
                    <li className="check__item">
                        <span className='txt'>{ t('Tugilgan yili') }</span>
                        <span className='dots'/>
                        <span className='txt font'>{ me?.birth_date || t('Yoq') }</span>
                    </li>
                    <li className="check__item">
                        <span className='txt'>{ t('Millati') }</span>
                        <span className='dots'/>
                        <span className='txt font'>{ me?.region || t('Yoq') }</span>
                    </li>
                    <li className="check__item">
                        <span className='txt'>{ t('Imtixon turi') }</span>
                        <span className='dots'/>
                        <span className='txt font'>{ me?.offline || t('Yoq') }</span>
                    </li>
                    <li className="check__item">
                        <span className='txt'>{ t('Qayd varaqasi') }</span>
                        <span className='dots'/>
                        {app?.data ? (
                            <button className='txt btn' onClick={() => downloadFile(me?.id)}>
                                <i className="fa-solid fa-download"/>
                                <span>{t('Yuklash')}</span>
                            </button>
                        ) : (
                            <span className='txt font'>{t('Yoq')}</span>
                        )}
                    </li>
                    <li className="check__item">
                    <span className='txt'>{t('Talaba shartnomasi')}</span>
                        <span className='dots'/>
                        <span className='txt font'>{ t('Yoq') }</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default MainC;