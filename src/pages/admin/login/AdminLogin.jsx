import './Login.scss'
import React, {useState} from 'react';
import {Button, Form, Input} from "antd";
import toast from "react-hot-toast";
import {$resp} from "../../../api/apiResp.js";
import {useMutation} from "@tanstack/react-query";


const fetchLogin = async (body) => {
    const { data } = await $resp.post('/auth/login', body)
    return data
}


const Auth = () => {

    const [loading, setLoading] = useState(false)


    // log in
    const mutation = useMutation({
        mutationFn: fetchLogin,
        onSuccess: (res) => {
            setLoading(true)
            toast.success(res.message)

            localStorage.setItem('admin-token', res.token)
            window.location.href = '/admin/university'
        },
        onError: (err) => {
            toast.error(`Ошибка: ${err.response?.data?.message || err.message}`)
            setLoading(false)
        }
    })

    const onFinish = (values) => {
        mutation.mutate(values)
        setTimeout(() => setLoading(false), 3000)
    }


    return (
        <div className="admin-login">
            <div className="admin-login__inner">
                <h2 className="admin-login__title mb2">Kirish</h2>
                <Form
                    name="basic"
                    layout='vertical'
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Telefon raqam"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Telefon raqamni kiriting!',
                            },
                        ]}
                    >
                        <Input placeholder='Telefon raqam' type='tel' />
                    </Form.Item>
                    <Form.Item
                        label="Parol"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Parolni kiriting!',
                            },
                        ]}
                    >
                        <Input.Password placeholder='Parol' />
                    </Form.Item>
                    <Button
                        className="login__button"
                        type="primary"
                        htmlType="submit"
                        size='large'
                        loading={loading}
                    >
                        Tasdiqlash
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default Auth;