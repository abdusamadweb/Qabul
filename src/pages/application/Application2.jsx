import './Application.scss'
import React, {useEffect, useState} from 'react'
import {Button, Dropdown, Form, Input, Radio, Select, Steps, Upload} from "antd"
import {Link, useNavigate, useSearchParams} from "react-router-dom"
import {$resp} from "../../api/apiResp.js"
import {useMutation, useQuery} from "@tanstack/react-query"
import toast from "react-hot-toast"
import {useTranslation} from "react-i18next"
import {uploadProps} from "../../assets/scripts/global.js"
import logo from '../../assets/images/big-logo.svg'
import img from "../../assets/images/left.svg"
import ru from "../../assets/images/ru.png"
import us from "../../assets/images/us.png"
import uz from "../../assets/images/uz.png"


// fetch
const fetchTypes = async () => {
    const { data } = await $resp.get('/ad-type/all')
    return data
}
const chooseType = async (body) => {
    const { data } = await $resp.post("/admission/choice-type", body)
    return data
}

const fetchInst = async () => {
    const { data } = await $resp.get('/admission/edu-institution')
    return data
}
const chooseInst = async (body) => {
    const { data } = await $resp.post("/admission/edu-institution-accept", body)
    return data
}

const fetchOptions = async () => {
    const { data } = await $resp.get('/admission/edu-data-select-options')
    return data
}
const chooseOptions = async (body) => {
    const { data } = await $resp.post("/admission/edu-data-accept", body)
    return data
}

const checkPassport = async (body) => {
    const { data } = await $resp.post("/admission/auto-personal-data", body)
    return data
}


const Application2 = () => {

    const { i18n, t } = useTranslation()
    const lang = i18n.language
    const currentLang = i18n.language || 'uz'

    const navigate = useNavigate()
    const [form] = Form.useForm()

    const me = JSON.parse(localStorage.getItem('me'))
    const passport = JSON.parse(localStorage.getItem('passport'))

    const [loading, setLoading] = useState(false)
    const [nav, setNav] = useState(0)

    const [fileOn, setFileOn] = useState(false)
    const [file, setFile] = useState(null)


    // change nav from HREF
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const navParam = searchParams.get('nav')

        if (navParam) {
            setNav(Number(navParam))
        }
    }, [searchParams, setNav])


    // fetch
    const { data: types } = useQuery({
        queryKey: ['types'],
        queryFn: fetchTypes,
        keepPreviousData: true,
    })
    const { data: inst } = useQuery({
        queryKey: ['inst'],
        queryFn: fetchInst,
        keepPreviousData: true,
    })
    const { data: options } = useQuery({
        queryKey: ['options'],
        queryFn: fetchOptions,
        keepPreviousData: true,
        enabled: nav > 2
    })


    // mutate
    const muPassport = useMutation({
        mutationFn: checkPassport,
        onSuccess: (res) => {
            toast.success(res.message)

            setLoading(false)
            setNav(1)
        },
        onError: (err) => {
            setLoading(false)

            toast.error(`Ошибка: ${err.response?.data?.message || err.message}`)
        }
    })

    const muTypes = useMutation({
        mutationFn: chooseType,
        onSuccess: (res) => {
            toast.success(res.message)

            setLoading(false)
            setNav(2)
        },
        onError: (err) => {
            setLoading(false)

            toast.error(`Ошибка: ${err.response?.data?.message || err.message}`)
        }
    })

    const muInst = useMutation({
        mutationFn: chooseInst,
        onSuccess: (res) => {
            toast.success(res.message)

            setLoading(false)
            setNav(3)
        },
        onError: (err) => {
            setLoading(false)

            toast.error(`Ошибка: ${err.response?.data?.message || err.message}`)
        }
    })

    const muOptions = useMutation({
        mutationFn: chooseOptions,
        onSuccess: (res) => {
            toast.success(res.message)

            localStorage.setItem('login', 'success')

            setLoading(false)
            navigate('/profile')
        },
        onError: (err) => {
            setLoading(false)

            toast.error(`Ошибка: ${err.response?.data?.message || err.message}`)
        }
    })


    // submit
    const onFormSubmit = (val) => {

        if (nav === 0) {
            setLoading(true)

            const body = {
                pinfl: me?.jshir || passport?.pinfl,
                serial: me?.passport_id || passport?.serialAndNumber,
            }
            muPassport.mutate(body)
        }
        else if (nav === 1) {
            setLoading(true)

            const body = {
                type_id: val.type_id
            }
            muTypes.mutate(body)
        }
        else if (nav === 2) {
            setLoading(true)

            const body = {
                edu_ins_id: val.edu_ins_id,
                end_date: val.end_date,
                file_id: (file && fileOn) ? file?.file.response.files[0].id : null,
            }
            muInst.mutate(body)
        }
        else if (nav === 3) {
            setLoading(true)

            const body = {
                edu_form_id: val.edu_form_id,
                edu_lang_id: val.edu_lang_id,
                edu_direction_id: val.edu_direction_id,
            }
            muOptions.mutate(body)
        }
    }


    // lang
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


    // selects
    const [selectedFormId, setSelectedFormId] = useState(null)
    const [selectedLangId, setSelectedLangId] = useState(null)

    const handleFormChange = (value) => {
        setSelectedFormId(value)
        setSelectedLangId(null)

        // 👇 Обязательно сбросить значения select-ов в форме
        form.setFieldsValue({
            edu_lang_id: null,
            edu_direction_id: null,
        })
    }

    const handleLangChange = (value) => {
        setSelectedLangId(value)

        form.setFieldsValue({
            edu_direction_id: null,
        })
    }

    const filteredLangs = options?.edu_langs?.filter(lang =>
        lang.edu_form_ids.includes(selectedFormId)
    )

    const filteredDirections = options?.edu_directions?.filter(dir =>
        dir.edu_lang_ids.includes(selectedLangId)
    )


    // генерируем список годов от текущего до (текущий год - 50)
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 50 }, (_, i) => ({
        value: currentYear - i,
        label: currentYear - i,
    }))


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
                            <div className='appl2'>
                                <div>
                                    <p className="title">{ t('Shaxsiy ma’lumotlar') }</p>
                                    <Steps
                                        current={nav}
                                        labelPlacement="vertical"
                                        responsive={false}
                                        items={[ {}, {}, {}, {} ]}
                                    />
                                </div>
                                <Form
                                    className='form'
                                    onFinish={onFormSubmit}
                                    layout='vertical'
                                    form={form}
                                >
                                    {nav > 0 && (
                                        <button className="back-btn" type='button' onClick={() => setNav(prev => prev - 1)}>
                                            <i className="fa-solid fa-arrow-left"/>
                                        </button>
                                    )}

                                    {nav === 0 && (
                                        <ul className='check'>
                                            <li className="check__item">
                                                <span className='txt'>{ t('F.I.O') }</span>
                                                <span className='dots'/>
                                                <span className='txt font'>{ me?.first_name && me?.last_name
                                                    ? `${me.first_name} ${me.last_name}`
                                                    : passport?.firstName && passport?.lastName
                                                        ? `${passport.firstName} ${passport.lastName}`
                                                        : '' }</span>
                                            </li>
                                            <li className="check__item">
                                                <span className='txt'>{ t('JSHSHIR') }</span>
                                                <span className='dots'/>
                                                <span className='txt font'>{ me?.jshir || passport?.pinfl }</span>
                                            </li>
                                            <li className="check__item">
                                                <span className='txt'>{ t('Seriya va raqami') }</span>
                                                <span className='dots'/>
                                                <span className='txt font'>{ me?.passport_id || passport?.serialAndNumber }</span>
                                            </li>
                                            <li className="check__item">
                                                <span className='txt'>{ t('Tugilgan yili') }</span>
                                                <span className='dots'/>
                                                <span className='txt font'>{ new Date(me?.birth_date || passport?.birthDate)?.toLocaleDateString() }</span>
                                            </li>
                                        </ul>
                                    )}

                                    {nav === 1 && (
                                        <div className='type'>
                                            <Form.Item
                                                name='type_id'
                                                rules={[{required: true, message: t('Tanlang')}]}
                                            >
                                                <Radio.Group
                                                    block
                                                    options={types?.map(i => (
                                                        { label: <div className='row align-center g10'>
                                                                <i className="fa-solid fa-book-open-reader"/>
                                                                <span>{ i.name }</span>
                                                            </div>,
                                                            value: i.id }
                                                    ))}
                                                    optionType="button"
                                                />
                                            </Form.Item>
                                        </div>
                                    )}

                                    {nav === 2 && (
                                        <div className='type about'>
                                            <Form.Item
                                                name='edu_ins_id'
                                                label={ t('Tugatgan talim muasssasangiz turini talnang') }
                                                rules={[{required: true, message: t('Tanlang')}]}
                                            >
                                                <Radio.Group
                                                    block
                                                    options={inst?.data?.map(i => (
                                                        { label: <div className='row align-center g10'>
                                                                <i className="fa-solid fa-book-open-reader"/>
                                                                <span>{ i[`name_${lang}`] }</span>
                                                            </div>,
                                                            value: i.id }
                                                    ))}
                                                    optionType="button"
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                name='end_date'
                                                label={ t('Bitirgan yili') }
                                                rules={[{required: true, message: ''}]}
                                            >

                                                <Select
                                                    size='large'
                                                    placeholder={t('Bitirgan yili')}
                                                    options={years}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                name='file_on'
                                                label={ t('Sertifikatingiz bormi?') }
                                            >
                                                <Radio.Group
                                                    className='sert'
                                                    onChange={(e) => setFileOn(e.target.value)}
                                                    options={[
                                                        { label: t('Ha'), value: true },
                                                        { label: t('Yoq'), value: false },
                                                    ]}
                                                />
                                            </Form.Item>
                                            {fileOn && (
                                                <Form.Item
                                                    className='upload'
                                                    name='file_id'
                                                    rules={[{required: fileOn, message: ''}]}
                                                >
                                                    <Upload
                                                        {...uploadProps}
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
                                            )}
                                        </div>
                                    )}

                                    {nav === 3 && (
                                        <div className='select'>
                                            <Form.Item
                                                name='edu_form_id'
                                                label={t('Talim shakli')}
                                                rules={[{required: true, message: ''}]}
                                            >
                                                <Select
                                                    size='large'
                                                    placeholder={t('Talim shakli')}
                                                    onChange={handleFormChange}
                                                    options={options?.edu_forms?.map(i => ({
                                                        label: i[`name_${currentLang}`],
                                                        value: i.id
                                                    }))}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                name='edu_lang_id'
                                                label={t('Talim tili')}
                                                rules={[{required: true, message: ''}]}
                                            >
                                                <Select
                                                    size='large'
                                                    placeholder={t('Talim tili')}
                                                    onChange={handleLangChange}
                                                    disabled={!selectedFormId}
                                                    options={filteredLangs?.map(i => ({
                                                        label: i[`name_${currentLang}`],
                                                        value: i.id
                                                    }))}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                name='edu_direction_id'
                                                label={t('Talim yonalishi')}
                                                rules={[{required: true, message: ''}]}
                                            >
                                                <Select
                                                    size='large'
                                                    placeholder={t('Talim yonalishi')}
                                                    disabled={!selectedLangId}
                                                    options={filteredDirections?.map(i => ({
                                                        label: i[`name_${currentLang}`],
                                                        value: i.id
                                                    }))}
                                                />
                                            </Form.Item>
                                        </div>
                                    )}

                                    <Button
                                        className='btn'
                                        loading={loading}
                                        size='large'
                                        htmlType="submit"
                                        type='primary'
                                    >
                                        {t('Tasdiqlash')}
                                    </Button>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Application2