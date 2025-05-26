import './Application.scss'
import React, {useEffect, useState} from 'react'
import {Button, Dropdown, Form, Input, Upload} from "antd";
import img from '../../assets/images/hero-img.png'
import uz from '../../assets/images/uz.png'
import ru from '../../assets/images/ru.png'
import us from '../../assets/images/us.png'
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import logo from '../../assets/images/logo.png'
import {useTranslation} from 'react-i18next';
import {$resp} from "../../api/apiResp.js";
import {useMutation, useQuery} from "@tanstack/react-query";
import toast from "react-hot-toast";
import {BirthDateInput, JshInput, PassportInput, PhoneInput} from "../../components/inputs/Inputs.jsx";
import {uploadProps} from "../../assets/scripts/global.js";
import {getRequest} from "../../hooks/useCrud.jsx";


// fetch
const searchPassport = async (body) => {
    const { data } = await $resp.post("/admission/check-passport", body)
    return data
}
const doManualPass = async (body, token) => {
    const finalToken = token || localStorage.getItem('token') // tokenni tanlash

    const { data } = await $resp.post("/admission/manual-personal-data", body, {
        headers: {
            Authorization: `Bearer ${finalToken}`
        }
    })
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

const resetSms = async (body) => {
    const { data } = await $resp.post("/auth/access-code", body)
    return data
}
const resetPsw = async (body) => {
    const { data } = await $resp.post("/auth/reset-password", body)
    return data
}


const Application = () => {

    const navigate = useNavigate()
    const { t } = useTranslation()

    const [form] = Form.useForm()

    const [loading, setLoading] = useState(false)

    const [count, setCount] = useState(0)

    const [exist, setExist] = useState(false)
    const [autoPass, setAutoPass] = useState(false)

    const [token, setToken] = useState(null)
    const [smsId, setSmsId] = useState(null)

    const [file, setFile] = useState(null)

    const [reset, setReset] = useState({
        phone: '',
        sms_id: '',
        code: ''
    })

    // sms timer
    const [active, setActive] = useState(false)
    const [timeLeft, setTimeLeft] = useState(120)


    // mutates
    const muPhone = useMutation({
        mutationFn: checkPhone,
        onSuccess: (res) => {
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

            setToken(res.token)
            localStorage.setItem('token', res.token)
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
            setToken(res.token)

            setTimeout(() => {
                setLoading(false)
                setCount(3)
            }, 1000)
        },
        onError: (err) => {
            setLoading(false)

            toast.error(`Ошибка: ${err.response?.data?.message || err.message}`)
        }
    })

    const muPassport = useMutation({
        mutationFn: (body) => autoPass
            ? searchPassport(body)
            : doManualPass(body, token),
        onSuccess: (res) => {
            toast.success(res.message)

            setLoading(false)

            localStorage.setItem('passport', JSON.stringify(res || {}))

            window.location = autoPass ? '/application' : '/application?autoPass=false'
        },
        onError: (err) => {
            setLoading(false)

            toast.error(`Ошибка: ${err.response?.data?.message || err.message}`)
        }
    })

    // ------------------------------------------
    const muResetSms = useMutation({
        mutationFn: resetSms,
        onSuccess: (res) => {
            toast.success(res.message)

            setReset({
                ...reset,
                sms_id: res?.data.sms_id
            })
        },
        onError: (err) => {
            setLoading(false)

            toast.error(`Ошибка: ${err.response?.data?.message || err.message}`)
        }
    })

    const muResetPsw = useMutation({
        mutationFn: resetPsw,
        onSuccess: (res) => {
            toast.success(res.message)

            setTimeout(() => {
                form.setFieldsValue({ password: '' })
                setLoading(false)
                setCount(1)
            }, 1000)
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
                passport_file_id: file ? file?.file.response.files[0].id : null,
            }
            muPassport.mutate(body)
        }
        // ------------------------------------------------------------
        else if (count === 10) {
            setLoading(true)

            const body = {
                password: val.password,
                sms_id: reset.sms_id,
                code: val.code2,
            }
            muResetPsw.mutate(body)
        }
    }

    const submitResetSms = () => {
        const body = { phone: reset.phone }
        muResetSms.mutate(body)
    }


    // fetch ME
    const getMe = async (token) => {
        const accessToken = token || localStorage.getItem('token');
        return await getRequest('/user/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        })
    }
    const { data: me } = useQuery({
        queryKey: ['me'],
        queryFn: () => getMe(token),
        keepPreviousData: true,
        enabled: !!token || count === 3
    })

    useEffect(() => {
        if (me) {
            localStorage.setItem('me', JSON.stringify(me))
            setAutoPass(me?.pasport_is_avto)

            setTimeout(() => {
                if (me?.state === 'passed') {
                    window.location = '/'
                    setLoading(false)
                } else if (me?.state === 'enter-personal-data') {
                    navigate('/login?count=3')
                    setLoading(false)
                } else if (me?.state === 'admission-type') {
                    window.location = '/application/?nav=1'
                } else if (me?.state === 'edu-data') {
                    window.location = '/application/?nav=2'
                } else if (me?.state === 'edu-directions') {
                    window.location = '/application/?nav=3'
                }
            }, 100)
        }
    }, [me, token])


    // change nav from HREF
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const navParam = searchParams.get('count')

        if (navParam) {
            setCount(Number(navParam))
        }
    }, [searchParams, setCount])


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

    const retryOnFinish = (val) => {
        startTimer()

        const body = {
            phone_number: '+998' + val.phone_number,
            sms_id: smsId,
            code: val.code,
        }
        muSms.mutate(body)
    }


    // lang
    const { i18n } = useTranslation()

    const langItems = [
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

    const rawLang = i18n.language || 'uz';
    const currentLang = rawLang.split('-')[0]


    return (
        <div className='appl'>
            <div className="container h100 grid-center">
                <div className="appl__content grid-center">
                    <div className='wrapper'>
                        <div className='left grid-center'>
                            <img className='logo' src={logo} alt="logo"/>
                            <img className='img' src={img} alt="img"/>
                            <div className="title">
                                <h2>Sharq universiteti</h2>
                                <h2>Hoziroq ro’yxatdan o’ting!</h2>
                            </div>
                        </div>
                        <div className='right grid-center'>
                            <div className="top row between align-center g1">
                            <div/>
                                <div className="row align-center g1">
                                    <Dropdown menu={{ items: langItems }} placement="bottomRight">
                                        <Button className="btn row align-center g10">
                                            <span>{languageMap[currentLang]?.label}</span>
                                            <img src={languageMap[currentLang]?.flag} alt="flag" />
                                        </Button>
                                    </Dropdown>
                                    {count > 2 && count !== 10 && (
                                        <button className="x-btn" onClick={() => window.location = '/'}>
                                            <i className="fa-solid fa-xmark" />
                                        </button>
                                    )}
                                </div>
                            </div>
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
                                        <>
                                            <Form.Item
                                                name="phone_number"
                                                label={t("Telefon raqam")}
                                                rules={[{ required: true, message: "" }]}
                                            >
                                                <PhoneInput onChange={(e) => setReset({...reset, phone: `+998${e}`})} />
                                            </Form.Item>
                                        </>
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
                                            {
                                                !exist ?
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
                                                    :
                                                    <button
                                                        className='reset'
                                                        type='button'
                                                        onClick={() => {
                                                            setCount(10)
                                                            submitResetSms()
                                                        }}
                                                    >
                                                        { t('Parolni unutdingizmi?') }
                                                    </button>
                                            }
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
                                        <>
                                            {autoPass ?
                                                <div>
                                                    <Form.Item
                                                        name='pinfl'
                                                        label={t('JSHSHIR')}
                                                    >
                                                        <JshInput />
                                                    </Form.Item>
                                                    <Form.Item
                                                        name='serial'
                                                        label={t('Seriyasi va raqami')}
                                                    >
                                                        <PassportInput />
                                                    </Form.Item>
                                                </div>
                                                :
                                                <div>
                                                    <Form.Item
                                                        name='first_name'
                                                        label={t('Ism')}
                                                        rules={[{required: true, message: ''}]}
                                                    >
                                                        <Input placeholder={t('Ism')} />
                                                    </Form.Item>
                                                    <Form.Item
                                                        name='last_name'
                                                        label={t('Familiya')}
                                                        rules={[{required: true, message: ''}]}
                                                    >
                                                        <Input placeholder={t('Familiya')} />
                                                    </Form.Item>
                                                    <Form.Item
                                                        name='patron'
                                                        label={t('Otasining imsi')}
                                                        rules={[{required: true, message: ''}]}
                                                    >
                                                        <Input placeholder={t('Otasining imsi')} />
                                                    </Form.Item>
                                                    <Form.Item
                                                        name='birth_date'
                                                        label={t('Tugilgan kuni') + '(yyyy-oo-kk)'}
                                                        rules={[{required: true, message: ''}]}
                                                    >
                                                        <BirthDateInput />
                                                    </Form.Item>
                                                    <Form.Item
                                                        name='jshir'
                                                        label={t('JSHSHIR')}
                                                        rules={[{required: true, message: ''}]}
                                                    >
                                                        <JshInput />
                                                    </Form.Item>
                                                    <Form.Item
                                                        name='passport_id'
                                                        label={t('Seriyasi va raqami')}
                                                        rules={[{required: true, message: ''}]}
                                                    >
                                                        <PassportInput />
                                                    </Form.Item>
                                                    <Form.Item
                                                        className='upload'
                                                        name='passport_file_id'
                                                        label={t('Passport fayl')}
                                                        rules={[{required: true, message: ''}]}
                                                    >
                                                        <Upload
                                                            {...uploadProps}
                                                            headers={{
                                                                Authorization: `Bearer ${token || localStorage.getItem('token')}`
                                                            }}
                                                            onChange={(e) => setFile(e)}
                                                            listType="text"
                                                        >
                                                            <Input
                                                                rootClassName={file?.file.percent !== null && 'change-icon'}
                                                                size='large'
                                                                suffix={<i className="fa-solid fa-upload"/>}
                                                                prefix={file ? file?.file.percent?.toFixed(1) + '%' : 'Yuklash'}
                                                            />
                                                        </Upload>
                                                    </Form.Item>
                                                </div>
                                            }
                                        </>
                                    )}

                                    {count === 10 && (
                                        <>
                                            <Form.Item
                                                name="password"
                                                label={t("Yangi parolni kiriting")}
                                                rules={[{ required: true, message: t("Parol majburiy") }]}
                                            >
                                                <Input type="text" placeholder={t("Yangi parolni kiriting")} />
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

                                            <Form.Item
                                                name="code2"
                                                label={t("Kodni kiriting") + ' (sms)'}
                                                rules={[{ required: true, message: "" }]}
                                            >
                                                <Input type="tel" placeholder={t("Kodni kiriting") + ' (sms)'} />
                                            </Form.Item>
                                        </>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Application;