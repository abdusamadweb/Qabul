import './Application.scss'
import React, {useEffect, useState} from 'react'
import {Button, Dropdown, Form, Input} from "antd";
import {IMaskInput} from "react-imask";
import img from '../../assets/images/left.svg'
import uz from '../../assets/images/uz.png'
import ru from '../../assets/images/ru.png'
import us from '../../assets/images/us.png'
import Application2 from "./Application2.jsx";

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
});

const Application = () => {

    const [form] = Form.useForm()

    const [nav, setNav] = useState(false)
    const [count, setCount] = useState(0)

    const [loading, setLoading] = useState(false)

    // sms timer
    const [active, setActive] = useState(false)
    const [timeLeft, setTimeLeft] = useState(120)


    // submit form
    const onFormSubmit = (values) => {

        if (count === 0) {
            setLoading(true)

            startTimer()

            setTimeout(() => {
                setCount(1)
                setLoading(false)
            }, 1000)

        } else if (count === 1) {
            setLoading(true)

            setTimeout(() => {
                setCount(2)
                setLoading(false)
            }, 1000)

        } else if (count === 2) {
            setLoading(true)

            setTimeout(() => {
                setNav(true)
                setLoading(false)
            }, 1000)

        }

        const body = {
            ...values,
        }
        console.log(count, '--- count ---')
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
    const items = [
        {
            key: '1',
            label: (
                <button className='top-btn'>
                    <span>Russian</span>
                    <img src={ru} alt="flag"/>
                </button>
            ),
        },
        {
            key: '2',
            label: (
                <button className='top-btn'>
                    <span>English</span>
                    <img src={us} alt="flag"/>
                </button>
            ),
        },
    ]


    return (
        <div className='appl'>
            <div className="container h100 grid-center">
                <div className="appl__content grid">
                    <div className='wrapper'>
                        <div className='left grid-center'>
                            <img src={img} alt="img"/>
                        </div>
                        <div className='right grid-center'>
                            <div className="top row between align-center g1">
                                <h1 className='logo'>Logo</h1>
                                <Dropdown menu={{items}} placement="bottomRight">
                                    <Button className='btn row align-center g10'>
                                        <span>Uzbek</span>
                                        <img src={uz} alt="flag"/>
                                    </Button>
                                </Dropdown>
                            </div>
                            {
                                !nav ?
                                    <div>
                                        <div>
                                            <p className="title">Kabinetga kirish</p>
                                            <p className="subtitle">"Qabul-2025" platformasiga xush kelibsiz!</p>
                                            <p className="desc">Kirish uchun pastdagi formani to’ldiring!</p>
                                        </div>
                                        <Form
                                            className='form'
                                            onFinish={onFormSubmit}
                                            layout='vertical'
                                            form={form}
                                        >

                                            {count < 2 && (
                                                <Form.Item
                                                    name='phone_number'
                                                    label='Telefon raqam'
                                                    rules={[{required: true, message: ''}]}
                                                >
                                                    <PhoneInput/>
                                                </Form.Item>
                                            )}

                                            {count === 1 && (
                                                <div>
                                                    <Form.Item
                                                        name='code'
                                                        label='Kodni kiriting'
                                                        rules={[{required: true, message: ''}]}
                                                    >
                                                        <Input type='tel' placeholder='Kodni kiriting'/>
                                                    </Form.Item>
                                                    <div className='sms-retry'>
                                                        <p className='txt'>SMS ni qayta yuborish:</p>
                                                        {
                                                            active ?
                                                                <span className='sms-btn'>{formatTime(timeLeft)}</span>
                                                                :
                                                                <button className='sms-btn' onClick={retryOnFinish}
                                                                        type='button'>Qayta
                                                                    yuborish</button>
                                                        }
                                                    </div>
                                                </div>
                                            )}

                                            {count > 1 && (
                                                <div>
                                                    <Form.Item
                                                        name='password'
                                                        label='Parolni kiriting'
                                                        rules={[{required: true, message: ''}]}
                                                    >
                                                        <Input type='text' placeholder='Parolni kiriting'/>
                                                    </Form.Item>
                                                    <Form.Item
                                                        name='cPassword'
                                                        label='Parolni tasdiqlang'
                                                        rules={[{required: true, message: ''}]}
                                                    >
                                                        <Input type='text' placeholder='Parolni kiriting'/>
                                                    </Form.Item>
                                                </div>
                                            )}

                                            <Button
                                                className='btn'
                                                loading={loading}
                                                size='large'
                                                htmlType="submit"
                                            >
                                                Tasdiqlash
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