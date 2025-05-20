import React from 'react';
import {Navigate} from "react-router-dom";

const Admin = () => {

    const token = localStorage.getItem('admin-token')

    return (
        token ? <Navigate to='/admin/dashboard' />
            : <Navigate to='/admin/login' />
    );
};

export default Admin;