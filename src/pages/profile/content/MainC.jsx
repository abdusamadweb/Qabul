import React from 'react';

const MainC = () => {
    return (
        <div className="main-c">
            <p className="content__title">KUAF ga xush kelibsiz!</p>
            <div className="content__diver">
                <p className="title">Shaxsiy malumotlar</p>
                <ul className='check'>
                    <li className="check__item">
                        <span className='txt'>F.I.O</span>
                        <span className='dots'/>
                        <span className='txt font'>Malika Tursunova</span>
                    </li>
                    <li className="check__item">
                        <span className='txt'>JSHSHIR</span>
                        <span className='dots'/>
                        <span className='txt font'>12345678901234</span>
                    </li>
                    <li className="check__item">
                        <span className='txt'>Seriya va raqami</span>
                        <span className='dots'/>
                        <span className='txt font'>XX 1234567</span>
                    </li>
                    <li className="check__item">
                        <span className='txt'>Tugilgan yili</span>
                        <span className='dots'/>
                        <span className='txt font'>2002-02-22</span>
                    </li>
                    <li className="check__item">
                        <span className='txt'>Millati</span>
                        <span className='dots'/>
                        <span className='txt font'>Ozbek</span>
                    </li>
                    <li className="check__item">
                        <span className='txt'>Imtixon turi</span>
                        <span className='dots'/>
                        <span className='txt font'>Ofline</span>
                    </li>
                    <li className="check__item">
                        <span className='txt'>Qayd varaqasi</span>
                        <span className='dots'/>
                        <button className='txt btn'>
                            <i className="fa-solid fa-download"/>
                            <span>Yuklash</span>
                        </button>
                    </li>
                    <li className="check__item">
                        <span className='txt'>Talaba shartnomasi</span>
                        <span className='dots'/>
                        {/*<span className='txt font'>Ozbek</span>*/}
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default MainC;