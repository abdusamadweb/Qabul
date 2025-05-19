import './Application.scss'
import React, {useEffect, useState} from 'react'
import {Button, Dropdown, Form, Input} from "antd";
import {IMaskInput} from "react-imask";
import img from '../../assets/images/left.svg'
import uz from '../../assets/images/uz.png'
import ru from '../../assets/images/ru.png'
import us from '../../assets/images/us.png'
import Application2 from "./Application2.jsx";
import {Link, useNavigate} from "react-router-dom";
import logo from '../../assets/images/big-logo.svg'
import { useTranslation } from 'react-i18next';
import {$resp} from "../../api/apiResp.js";
import {useMutation} from "@tanstack/react-query";
import toast from "react-hot-toast";


const PhoneInput = React.forwardRef(({ value, onChange }, ref) => {
    return (
        <IMaskInput
            type="tel"
            mask="+998 00 000 00 00"
            lazy={false} // Показывает маску сразу
            placeholder="-"
            unmask={true} // Передает "чистый" номер в Form
            value={value} // Связывает с Form
            onAccept={onChange} // Передает изменения в Form
            inputRef={ref} // Ant Design ожидает, что ref будет передан в Input
        />
    );
})

const PassportInput = React.forwardRef(({ value, onChange }, ref) => {
    return (
        <IMaskInput
            className='inp-mask'
            mask="aa 0000000" // Две буквы и 7 цифр
            definitions={{
                a: /[a-zA-Z]/, // Разрешаем и строчные, и заглавные буквы
                0: /[0-9]/, // Только цифры
            }}
            lazy={false} // Показывает маску сразу
            unmask={true} // Передает "чистое" значение в Form
            value={value}
            onAccept={(val) => onChange(val.toUpperCase())}
            inputRef={ref}
        />
    );
})

const JshInput = React.forwardRef(({ value, onChange }, ref) => {
    return (
        <IMaskInput
            className='inp-mask'
            mask="00000000000000" // Две буквы и 14 цифр
            definitions={{
                0: /[0-9]/, // Только цифры
            }}
            lazy={false} // Показывает маску сразу
            unmask={true} // Передает "чистое" значение в Form
            value={value}
            onAccept={onChange}
            inputRef={ref}
        />
    );
})


// fetch
const searchPassport = async (body) => {
    const { data } = await $resp.post("/admission/check-passport", body)
    return data
}
const checkPhone = async (body) => {
    const { data } = await $resp.post("/auth/check-phone", body)
    return data
}
const register = async (body) => {
    const { data } = await $resp.post("/auth/register", body)
    return data
}
const login = async (body) => {
    const { data } = await $resp.post("/auth/login", body)
    return data
}
const checkSms = async (body) => {
    const { data } = await $resp.post("/auth/check-sms", body)
    return data
}


const Application = () => {

    const { t } = useTranslation()

    const navigate = useNavigate()
    const [form] = Form.useForm()

    const [count, setCount] = useState(0)
    const [nav, setNav] = useState(false)

    const [exist, setExist] = useState(false)
    const [smsId, setSmsId] = useState(null)

    const [loading, setLoading] = useState(false)

    // sms timer
    const [active, setActive] = useState(false)
    const [timeLeft, setTimeLeft] = useState(120)


    // submit form
    const muPhone = useMutation({
        mutationFn: checkPhone,
        onSuccess: (res) => {
            toast.success(res.message)

            setLoading(false)
            setCount(1)
            setExist(res.exists)
        },
        onError: (err) => {
            setLoading(false)

            toast.error(`Ошибка: ${err.response?.data?.message || err.message}`)
        }
    })

    const muRegister = useMutation({
        mutationFn: register,
        onSuccess: (res) => {
            toast.success(res.message)

            setLoading(false)
            setCount(2)
            setSmsId(res.data.sms_id)
        },
        onError: (err) => {
            setLoading(false)

            toast.error(`Ошибка: ${err.response?.data?.message || err.message}`)
        }
    })

    const muLogin = useMutation({
        mutationFn: login,
        onSuccess: (res) => {
            toast.success(res.message)

            localStorage.setItem('token', res.token)

            setLoading(false)
            navigate('/profile')
        },
        onError: (err) => {
            setLoading(false)

            toast.error(`Ошибка: ${err.response?.data?.message || err.message}`)
        }
    })

    const muSms = useMutation({
        mutationFn: checkSms,
        onSuccess: (res) => {
            toast.success(res.message)

            localStorage.setItem('token', res.token)

            setLoading(false)
            setCount(3)
        },
        onError: (err) => {
            setLoading(false)

            toast.error(`Ошибка: ${err.response?.data?.message || err.message}`)
        }
    })

    const muPassport = useMutation({
        mutationFn: searchPassport,
        onSuccess: (res) => {
            toast.success(res.message)

            setLoading(false)
            setNav(true)

            localStorage.setItem('user', JSON.stringify(res))
        },
        onError: (err) => {
            setLoading(false)

            toast.error(`Ошибка: ${err.response?.data?.message || err.message}`)
        }
    })


    const onFormSubmit = (val) => {

        if (count === 0) {
            setLoading(true)

            startTimer()

            const body = {
                phone_number: '+998' + val.phone_number
            }
            muPhone.mutate(body)

        }
        else if (count === 1) {
            setLoading(true)

            if (exist === true) {
                const body = {
                    phone: '+998' + val.phone_number,
                    password: val.password,
                }
                muLogin.mutate(body)
            } else {
                const body = {
                    phone_number: '+998' + val.phone_number,
                    password: val.password,
                }
                muRegister.mutate(body)
            }

        }
        else if (count === 2) {
            setLoading(true)

            const body = {
                phone_number: '+998' + val.phone_number,
                sms_id: smsId,
                code: val.code,
            }
            muSms.mutate(body)

        }
        else if (count === 3) {
            setLoading(true)

            const body = {
                ...val,
            }
            muPassport.mutate(body)
        }
    }


    // timer
    useEffect(() => {
        if (!active) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    setActive(false)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [active])

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`
    }

    function startTimer() {
        setTimeLeft(120)
        setActive(true)
    }

    const retryOnFinish = () => {

        startTimer()
        // mutation.mutate(sms.phone_number)
    }


    // lang
    const { i18n } = useTranslation()

    const items = [
        {
            key: 'ru',
            label: (
                <button className='top-btn' onClick={() => i18n.changeLanguage('ru')}>
                    <span>Russian</span>
                    <img src={ru} alt="flag" />
                </button>
            ),
        },
        {
            key: 'en',
            label: (
                <button className='top-btn' onClick={() => i18n.changeLanguage('en')}>
                    <span>English</span>
                    <img src={us} alt="flag" />
                </button>
            ),
        },
        {
            key: 'uz',
            label: (
                <button className='top-btn' onClick={() => i18n.changeLanguage('uz')}>
                    <span>Uzbek</span>
                    <img src={uz} alt="flag" />
                </button>
            ),
        },
    ]

    const languageMap = {
        ru: { label: 'Russian', flag: ru },
        en: { label: 'English', flag: us },
        uz: { label: 'Uzbek', flag: uz },
    }

    const currentLang = i18n.language || 'uz'


    return (
        <div className='appl'>
            <div className="container h100 grid-center">
                <div className="appl__content grid-center">
                    <div className='wrapper'>
                        <div className='left grid-center'>
                            <img src={img} alt="img"/>
                        </div>
                        <div className='right grid-center'>
                            <div className="top row between align-center g1">
                                <Link className='logo' to='/'>
                                    <img src={logo} alt="logo"/>
                                </Link>
                                <Dropdown menu={{ items }} placement="bottomRight">
                                    <Button className="btn row align-center g10">
                                        <span>{languageMap[currentLang]?.label}</span>
                                        <img src={languageMap[currentLang]?.flag} alt="flag" />
                                    </Button>
                                </Dropdown>
                            </div>
                            {
                                !nav ?
                                    <div>
                                        <div className='titles'>
                                            <p className="title">{ t('title') }</p>
                                            <p className="subtitle">{ t('subtitle') }</p>
                                            <p className="desc">{ t('desc') }</p>
                                        </div>
                                        <Form
                                            className='form'
                                            onFinish={onFormSubmit}
                                            layout='vertical'
                                            form={form}
                                        >

                                            {(count >= 0 && count < 3) && (
                                                <Form.Item
                                                    name="phone_number"
                                                    label={t("Telefon raqam")}
                                                    rules={[{ required: true, message: "" }]}
                                                >
                                                    <PhoneInput />
                                                </Form.Item>
                                            )}

                                            {(count >= 1 && count < 3) && (
                                                <>
                                                    <Form.Item
                                                        name="password"
                                                        label={t("Parolni kiriting")}
                                                        rules={[{ required: true, message: t("Parol majburiy") }]}
                                                    >
                                                        <Input type="text" placeholder={t("Parolni kiriting")} />
                                                    </Form.Item>
                                                    <Form.Item
                                                        name="re-password"
                                                        label={t("Parolni tasdiqlang")}
                                                        dependencies={['password']}
                                                        rules={[
                                                            { required: true, message: t("Parolni tasdiqlang") },
                                                            ({ getFieldValue }) => ({
                                                                validator(_, value) {
                                                                    if (!value || getFieldValue('password') === value) {
                                                                        return Promise.resolve()
                                                                    }
                                                                    return Promise.reject(new Error(t("Parollar mos emas")))
                                                                },
                                                            }),
                                                        ]}
                                                    >
                                                        <Input type="text" placeholder={t("Parolni tasdiqlang")} />
                                                    </Form.Item>
                                                </>
                                            )}

                                            {(count >= 2 && count < 3) && (
                                                <>
                                                    <Form.Item
                                                        name="code"
                                                        label={t("Kodni kiriting")}
                                                        rules={[{ required: true, message: "" }]}
                                                    >
                                                        <Input type="tel" placeholder={t("Kodni kiriting")} />
                                                    </Form.Item>

                                                    <div className="sms-retry">
                                                        <p className="txt">{t("SMS ni qayta yuborish")}:</p>
                                                        {active ? (
                                                            <span className="sms-btn">{formatTime(timeLeft)}</span>
                                                        ) : (
                                                            <button className="sms-btn" onClick={retryOnFinish} type="button">
                                                                {t("Qayta yuborish")}
                                                            </button>
                                                        )}
                                                    </div>
                                                </>
                                            )}

                                            {count === 3 && (
                                                <div>
                                                    <Form.Item
                                                        name='pinfl'
                                                        label={ t('JSHSHIR') }
                                                    >
                                                        <JshInput />
                                                    </Form.Item>
                                                    <Form.Item
                                                        name='serial'
                                                        label={ t('Seriyasi va raqami') }
                                                    >
                                                        <PassportInput />
                                                    </Form.Item>
                                                    {/*<div className="search row between">*/}
                                                    {/*    <span/>*/}
                                                    {/*    <button className="row align-center" type='button'>*/}
                                                    {/*        <span>Qidirish</span>*/}
                                                    {/*        <i className="fa-solid fa-magnifying-glass"/>*/}
                                                    {/*    </button>*/}
                                                    {/*</div>*/}
                                                </div>
                                            )}

                                            <Button
                                                className='btn'
                                                loading={loading}
                                                size='large'
                                                htmlType="submit"
                                                type='primary'
                                            >
                                                { t('Tasdiqlash') }
                                            </Button>
                                        </Form>
                                    </div>
                                    : <Application2/>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Application;