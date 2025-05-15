import React, {useState} from 'react';
import {Button, Form, Input, Radio, Select, Steps} from "antd";
import IMask from "imask";
import {IMaskInput} from "react-imask";
import {useNavigate} from "react-router-dom";

const BirthDateInput = React.forwardRef(({ value, onChange }, ref) => {
    return (
        <IMaskInput
            type='tel'
            mask="0000-00-00" // Формат YYYY-MM-DD
            blocks={{
                0: {
                    mask: IMask.MaskedRange,
                    from: 0,
                    to: 9,
                },
            }}
            lazy={false} // Показывает маску сразу
            placeholder="yyyy-mm-dd"
            unmask={false}
            value={value}
            onAccept={onChange} // Обновляет значение в Form
            inputRef={ref}
        />
    );
});

const Application2 = () => {

    const navigate = useNavigate()
    const [form] = Form.useForm()

    const [nav, setNav] = useState(0)
    const [loading, setLoading] = useState(false)
    console.log(nav)


    const onFormSubmit = (val) => {

        if (nav === 0) {
            setLoading(true)

            setTimeout(() => {
                setNav(1)
                setLoading(false)
            }, 1000)

        } else if (nav === 1) {
            setLoading(true)

            setTimeout(() => {
                setNav(2)
                setLoading(false)
            }, 1000)

        } else if (nav === 2) {
            setLoading(true)

            setTimeout(() => {
                setNav(3)
                setLoading(false)
            }, 1000)

        } else if (nav === 3) {
            setLoading(true)

            setTimeout(() => {
                navigate('/profile')
                setLoading(false)
            }, 1000)

        }

        const body = {
            ...val,
        }
    }


    const types = [
        { label: <div className='row align-center g10'>
                <i className="fa-solid fa-book-open-reader"/>
                <span>Bakalavriat</span>
            </div>,
            value: 'Bakalavriat'
        },
        { label: <div className='row align-center g10'>
                <i className="fa-solid fa-graduation-cap"/>
                <span>Oqishni kochirish</span>
            </div>,
            value: 'Oqishni kochirish'
        },
        { label: <div className='row align-center g10'>
                <i className="fa-solid fa-arrow-trend-down"/>
                <span>Maqsadli qabul</span>
            </div>,
            value: 'Maqsadli qabul'
        }
    ]

    const abouts = [
        { label: <div className='row align-center g10'>
                <i className="fa-solid fa-book-bookmark"/>
                <span>Akademik litsey</span>
            </div>,
            value: 'Akademik litsey'
        },
        { label: <div className='row align-center g10'>
                <i className="fa-solid fa-book-bookmark"/>
                <span>Kasb hunar kolleji</span>
            </div>,
            value: 'Kasb hunar kolleji'
        },
        { label: <div className='row align-center g10'>
                <i className="fa-solid fa-book-bookmark"/>
                <span>Profesional talim</span>
            </div>,
            value: 'Profesional talim'
        },
        { label: <div className='row align-center g10'>
                <i className="fa-solid fa-book-bookmark"/>
                <span>Maktab</span>
            </div>,
            value: 'Maktab'
        },
        { label: <div className='row align-center g10'>
                <i className="fa-solid fa-book-bookmark"/>
                <span>Oliy talim</span>
            </div>,
            value: 'Oliy talim'
        },
    ]


    return (
        <div className='appl2'>
            <div>
                <p className="title">Shaxsiy ma’lumotlar</p>
                <Steps
                    current={nav}
                    labelPlacement="vertical"
                    responsive={false}
                    items={[
                        {}, {}, {}, {}
                    ]}
                />
            </div>
            <Form
                className='form'
                onFinish={onFormSubmit}
                layout='vertical'
                form={form}
            >
                <button className="back-btn" type='button' onClick={() => setNav(prev => prev - 1)}>
                    <i className="fa-solid fa-arrow-left"/>
                </button>

                {nav === 0 && (
                    <ul className='check'>
                        <li className="check__item">
                            <span className='txt'>F.I.O</span>
                            <span className='dots'/>
                            <span className='txt font'>Malika Tursunova</span>
                        </li>
                        <li className="check__item">
                            <span className='txt'>JSHSHIR</span>
                            <span className='dots'/>
                            <span className='txt font'>12345678901234</span>
                        </li>
                        <li className="check__item">
                            <span className='txt'>Seriya va raqami</span>
                            <span className='dots'/>
                            <span className='txt font'>XX 1234567</span>
                        </li>
                        <li className="check__item">
                            <span className='txt'>Tugilgan yili</span>
                            <span className='dots'/>
                            <span className='txt font'>2002-02-22</span>
                        </li>
                    </ul>
                )}

                {nav === 1 && (
                    <div className='type'>
                        <Form.Item
                            name='type'
                            rules={[{required: true, message: ''}]}
                        >
                            <Radio.Group
                                block
                                options={types}
                                defaultValue="Bakalavriat"
                                optionType="button"
                            />
                        </Form.Item>
                    </div>
                )}

                {nav === 2 && (
                    <div className='type about'>
                        <Form.Item
                            name='talim'
                            label='Tugatgan talim muasssasangiz turini talnang'
                            rules={[{required: true, message: ''}]}
                        >
                            <Radio.Group
                                block
                                options={abouts}
                                optionType="button"
                            />
                        </Form.Item>
                        <Form.Item
                            name='year'
                            label='Bitirgan yili'
                            rules={[{required: true, message: ''}]}
                        >
                            <Input placeholder='Bitrgan yili' type='tel' />
                        </Form.Item>
                        <Form.Item
                            name='sertification'
                            label='Sertifikatingiz bormi?'
                        >
                            <Radio.Group
                                className='sert'
                                options={[
                                    { label: 'Ha', value: '1' },
                                    { label: 'Yoq', value: '0' },
                                ]}
                            />
                        </Form.Item>
                    </div>
                )}

                {nav === 3 && (
                    <div className='select'>
                        <Form.Item
                            name='study'
                            label='Talim shakli'
                            rules={[{required: true, message: ''}]}
                        >
                            <Select
                                size='large'
                                placeholder='Talim shakli'
                                options={[
                                    { value: 'jack', label: 'Jack' },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item
                            name='lang'
                            label='Talim tili'
                            rules={[{required: true, message: ''}]}
                        >
                            <Select
                                size='large'
                                placeholder='Talim tili'
                                options={[
                                    { value: 'jack', label: 'Jack' },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item
                            name='direct'
                            label='Talim yonalishi'
                            rules={[{required: true, message: ''}]}
                        >
                            <Select
                                size='large'
                                placeholder='Talim yonalishi'
                                options={[
                                    { value: 'jack', label: 'Jack' },
                                ]}
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
                    Tasdiqlash
                </Button>
            </Form>
        </div>
    );
};

export default Application2;