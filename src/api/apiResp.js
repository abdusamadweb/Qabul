import axios from "axios"
import $api, {API_TEST} from "./apiConfig"

export const userLang = navigator.language || navigator.userLanguage


export const $resp = axios.create({
    baseURL: API_TEST,
    headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem('token'),
    }
})

export const $adminResp = axios.create({
    baseURL: API_TEST,
    headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem('admin-token'),
    }
})


export const getFile = async (id) => {
    const response = await $api.get(`/get-file/${id}`, {
        responseType: "blob", // 👈 Добавляем, чтобы получить бинарные данные
    })
    return URL.createObjectURL(response.data) // 👈 Создаём URL для <img>
}
