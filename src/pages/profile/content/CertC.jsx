import React, {useState} from 'react';

const CertC = () => {

    const [modal, setModal] = useState(false)


    return (
        <div className="deal-c cert-c">
            <div className="titles row between align-center g1">
                <p className="content__title">Mening sertifikatlarim</p>
                <button className='btn row align-center g10' onClick={() => setModal(false)}>
                    <i className="fa-solid fa-circle-plus"/>
                    <span>Sertifikat qoshish</span>
                </button>
            </div>
            <div className="content__diver grid-center">
                <div className="empty">
                    <p className='empty__title'>Sertifikatlar mavjud emas</p>
                </div>
            </div>
        </div>
    );
};

export default CertC;