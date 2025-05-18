import './Title.scss'
import React from 'react';
import {useNavigate} from "react-router-dom";

const Title = ({ title, btn, setModal, additional, navigate, className }) => {

    const navigatee = useNavigate()

    if (!btn) return (
        <div className='page-title row align-center g1 pt1'>
            {
                navigate && <button className='navigate-btn' onClick={() => navigatee(-1)}>
                    <i className="fa-solid fa-arrow-left-long"/>
                </button>
            }
            <h2>{title}</h2>
            { additional }
        </div>
    )

    return (
        <div className='admin-titles additional'>
            <div className='row align-center g1'>
                {
                    navigate && <button className='navigate-btn' onClick={() => navigatee(-1)}>
                        <i className="fa-solid fa-arrow-left-long"/>
                    </button>
                }
                <h2 className="admin-titles__title">{ title }</h2>
            </div>
            <div className='row align-center g1'>
                { additional }
                <button className={`admin-titles__btn ${className}`} onClick={() => setModal('add')}>
                    <span>Qoshish</span>
                    <i className="fa-solid fa-circle-plus"/>
                </button>
            </div>
        </div>
    );
};

export default Title