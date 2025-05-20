import React from 'react';
import {useTranslation} from "react-i18next";

const MainC = () => {

    const { t } = useTranslation()

    const passport = JSON.parse(localStorage.getItem('passport'))


    return (
        <div className="main-c">
            <p className="content__title">KUAF - { t('Xush kelibsiz!') }</p>
            <div className="content__diver">
                <p className="title">{ t('Shaxsiy malumotlar') }</p>
                <ul className='check'>
                    <li className="check__item">
                        <span className='txt'>{ t('F.I.O') }</span>
                        <span className='dots'/>
                        <span className='txt font'>{ passport?.firstName + ' ' + passport?.lastName }</span>
                    </li>
                    <li className="check__item">
                        <span className='txt'>{ t('JSHSHIR') }</span>
                        <span className='dots'/>
                        <span className='txt font'>{ passport?.pinfl }</span>
                    </li>
                    <li className="check__item">
                        <span className='txt'>{ t('Seriya va raqami') }</span>
                        <span className='dots'/>
                        <span className='txt font'>{ passport?.serialAndNumber }</span>
                    </li>
                    <li className="check__item">
                        <span className='txt'>{ t('Tugilgan yili') }</span>
                        <span className='dots'/>
                        <span className='txt font'>{ passport?.birthDate }</span>
                    </li>
                    <li className="check__item">
                        <span className='txt'>{ t('Millati') }</span>
                        <span className='dots'/>
                        <span className='txt font'>Ozbek</span>
                    </li>
                    <li className="check__item">
                        <span className='txt'>{ t('Imtixon turi') }</span>
                        <span className='dots'/>
                        <span className='txt font'>Offline</span>
                    </li>
                    <li className="check__item">
                        <span className='txt'>{ t('Qayd varaqasi') }</span>
                        <span className='dots'/>
                        <button className='txt btn'>
                            <i className="fa-solid fa-download"/>
                            <span>{ t('Yuklash') }</span>
                        </button>
                    </li>
                    <li className="check__item">
                        <span className='txt'>{ t('Talaba shartnomasi') }</span>
                        <span className='dots'/>
                        {/*<span className='txt font'>Ozbek</span>*/}
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default MainC;