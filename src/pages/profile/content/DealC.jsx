import React from 'react';
import {useTranslation} from "react-i18next";

const DealC = () => {

    const { t } = useTranslation()


    return (
        <div className="deal-c">
            <p className="content__title">{ t('Mening shartnomam') }</p>
            <div className="content__diver grid-center">
                <div className="empty">
                    <p className='empty__title'>{ t('Shartnoma mavjud emas') }</p>
                </div>
            </div>
        </div>
    );
};

export default DealC;