import React from 'react'
import {Navigate, Outlet} from "react-router-dom"

const Auth = () => {

    const login = localStorage.getItem('login')

    return (
        login === 'success' ? <Outlet />
            : <Navigate to="/" />
    )
}

export default Auth