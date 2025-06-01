import React, {useEffect} from 'react';
import {Navigate, useNavigate} from "react-router-dom";
import {getRequestAdmin} from "../../hooks/useCrud.jsx";
import {useQuery} from "@tanstack/react-query";

const Admin = () => {

    // fetch me
    const getMe = () => getRequestAdmin('/user/me')
    const { data: me } = useQuery({
        queryKey: ['me-admin'],
        queryFn: getMe,
        keepPreviousData: true,
        enabled: window.location.pathname === '/admin',
    })
    useEffect(() => {
        if (me) localStorage.setItem('meAdmin', JSON.stringify(me))
    }, [me])


    const navigate = useNavigate()
    const token = localStorage.getItem('admin-token')

    if (me && token) {
        return setTimeout(() => navigate('/admin/feeds'), 500)
    } else {
        return navigate('/admin/login')
    }
}

export default Admin;