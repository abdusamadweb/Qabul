import {$resp} from "../../api/apiResp.js";
import {API_TEST} from "../../api/apiConfig.js";
import toast from "react-hot-toast";
import {Upload} from "antd";


// form
export const validateMessages = {
    required: '${label} toldirilishi shart!',
}


// site language
export const lang = localStorage.getItem('lang') || 'en'
export const changeLang = (lang) => {
    localStorage.setItem('lang', lang)
    window.location.reload()
}


// format price
export const formatPrice = (price) => {
    return Intl.NumberFormat('ru-RU').format(price)
}


// format phone number
export const formatPhone = (str) => {
    const mask = "+### ## ### ## ##"
    if (!str) return mask
    if (!mask) return str
    const numeric = str?.replaceAll(/[^\d]/g, "")
    let idx = 0
    const formatted = mask?.split("").map((el) => {
        if (el === "#") {
            el = numeric[idx]
            idx++
        }
        return el
    })
    return formatted.join("")
}


// upload files
export const uploadProps = {
    name: 'file',
    maxCount: 1,
    action: API_TEST + '/upload-file',
    beforeUpload: (file) => {
        const isImageOrPdf = file.type === 'application/pdf' || file.type.startsWith('image/');
        if (!isImageOrPdf) {
            toast.error('Faqat rasm yoki PDF yuklash mumkin! ❌');
            return Upload.LIST_IGNORE;
        }

        const isLt1M = file.size / 5120 / 5120 < 1;
        if (!isLt1M) {
            toast.error('Fayl hajmi 5MB dan kichik bo‘lishi kerak! ❌');
            return Upload.LIST_IGNORE;
        }

        return true;
    },
    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file);
        }

        if (info.file.status === 'done') {
            toast.success(`${info.file.name} yuklandi! ✅`);
        } else if (info.file.status === 'error') {
            toast.error(`${info.file.name} xatolik! ❌`);
        }
    },
}


// upload file
export const uploadFile = async (file) => {
    const formData = new FormData()
    formData.append('file', file) // Важно: 'file' — это ключ, который ждёт API

    const { data } = await $resp.post('/upload-file', formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })

    return data
}



