import React from 'react'
import {Navigate, Outlet} from "react-router-dom"

const Auth = ({ reff }) => {

    const token = localStorage.getItem('token')

    return (
        token ? <Outlet />
            : reff ? <Navigate to={`/login?ref=${reff}`} />
                : <Navigate to='/login' />
    )
}

export default Auth