import './Dashboard.scss'
import React from 'react';
import Title from "../../../components/admin/title/Title.jsx";

const Dashboard = () => {
    return (
        <div className="dashboard page">
            <div className="container">
                <Title title='Statistika' />
                <div className="content">
                    <div className="users wrapper">
                        <h3 className="title">Foydalanuvchilar soni</h3>
                        <div>

                        </div>
                    </div>
                    <div className="appls wrapper">
                        <h3 className="title">Arizalar soni</h3>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;