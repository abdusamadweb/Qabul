import React, {useState} from 'react';
import {useTranslation} from "react-i18next";

const CertC = () => {

    const { t } = useTranslation()

    const [modal, setModal] = useState(false)


    return (
        <div className="deal-c cert-c">
            <div className="titles row between align-center g1">
                <p className="content__title">{ t('Mening sertifikatlarim') }</p>
                <button className='btn row align-center g10' onClick={() => setModal(false)}>
                    <i className="fa-solid fa-circle-plus"/>
                    <span>{ t('Sertifikat qoshish') }</span>
                </button>
            </div>
            <div className="content__diver grid-center">
                <div className="empty">
                    <p className='empty__title'>{ t('Sertifikatlar mavjud emas') }</p>
                </div>
            </div>
        </div>
    );
};

export default CertC;