import React from 'react';
import {useTranslation} from "react-i18next";

const DealC = ({ app, downloadContract }) => {

    const { t } = useTranslation()


    return (
        <div className="deal-c">
            <p className="content__title">{ t('Mening shartnomam') }</p>
            <div className="content__diver grid-center">
                {app?.data?.status === 'accepted' ? (
                    <div className='w100'>
                        <button className='txt btn' onClick={() => downloadContract(app?.data?.id)}>
                            <i className="fa-solid fa-download"/>
                            <span>{t('Yuklash')}</span>
                        </button>
                    </div>
                ) : (
                    <div className="empty">
                        <p className='empty__title'>{t('Shartnoma mavjud emas')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DealC;