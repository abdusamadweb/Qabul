import axios from 'axios'

export const API_TEST = 'http://31.128.39.74:8080/api/v1'

const $api = axios.create({
    baseURL: API_TEST,
    headers: {
        "Content-Type": "application/json"
    }
})

export default $api
