import React, { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"

const Auth = () => {

    const navigate = useNavigate()
    const [checked, setChecked] = useState(false)



    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"))
        const token = localStorage.getItem("token")
        const state = localStorage.getItem("user-state")

        const chatId =
            window.Telegram?.WebApp?.initDataUnsafe?.user?.id ||
            new URLSearchParams(window.location.search).get("chat_id") ||
            "{null}"

        if (state === "system-active") {
            setChecked(true) // Позволяет рендерить Outlet
        } else if (state === "pre-in-data" || (token && state !== "system-active")) {
            navigate(`/login/auth?phone=${user?.phone_number}`, { replace: true })
        } else {
            navigate(`/login?chat_id=${chatId}`, { replace: true });
        }
    }, [navigate])

    if (!checked) return null // Не рендерим Outlet, пока не проверили auth

    return <Outlet />
}

export default Auth
