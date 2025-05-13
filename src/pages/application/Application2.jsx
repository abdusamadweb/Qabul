import React, {useState} from 'react';
import {Button, Form, Input, Steps} from "antd";
import IMask from "imask";
import {IMaskInput} from "react-imask";

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
});

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
            inputRef={ref}
        />
    );
});

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

    const [form] = Form.useForm()

    const [nav, setNav] = useState(0)
    const [loading, setLoading] = useState(false)


    const onFormSubmit = (values) => {



        const body = {
            ...values,
        }
    }


    return (
        <div className='appl2'>
            <div>
                <p className="title">Shaxsiy ma’lumotlar</p>
                <Steps
                    current={nav}
                    labelPlacement="vertical"
                    responsive={false}
                    items={[
                        {

                        },
                        {

                        },
                        {

                        },
                        {

                        },
                    ]}
                />
            </div>
            <Form
                className='form'
                onFinish={onFormSubmit}
                layout='vertical'
                form={form}
            >
                <Form.Item
                    name='jshir'
                    label='JSHSHIR'
                    rules={[{required: true, message: ''}]}
                >
                    <JshInput />
                </Form.Item>
                <Form.Item
                    name='passport'
                    label='Seriyasi va raqami'
                    rules={[{required: true, message: ''}]}
                >
                    <PassportInput />
                </Form.Item>
                <div className="search row between">
                    <span/>
                    <button className="row align-center">
                        <span>Qidirish</span>
                        <i className="fa-solid fa-magnifying-glass"/>
                    </button>
                </div>

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
    );
};

export default Application2;