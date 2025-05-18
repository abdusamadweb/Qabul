import React from 'react'
import {Navigate, Outlet} from "react-router-dom"

const AuthRedirect = () => {

    const token = localStorage.getItem("token")
    const state = localStorage.getItem("user-state")

    if (state === "system-active") {
        return <Outlet />
    } else if (state === "pre-in-data" || (token && state !== "system-active")) {
        const user = JSON.parse(localStorage.getItem("user"))
        return <Navigate to={`/login/auth?phone=${user?.phone_number}`} replace />
    }

    return <Navigate to="/login" replace /> // Если редирект не нужен, ничего не рендерим
}

export default AuthRedirect
