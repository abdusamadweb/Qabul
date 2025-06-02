import './Login.scss'
import React, {useState} from 'react';
import {Button, Form, Input} from "antd";
import toast from "react-hot-toast";
import {$resp} from "../../../api/apiResp.js";
import {useMutation} from "@tanstack/react-query";


const fetchLogin = async (body) => {
    const { data } = await $resp.post('/auth/a-login', body)
    return data
}


const Auth = () => {


    // log in
    const mutation = useMutation({
        mutationFn: fetchLogin,
        onSuccess: (res) => {
            toast.success(res.message)

            localStorage.setItem('admin-token', res.token)
            window.location.href = '/admin'
        },
        onError: (err) => {
            toast.error(`Ошибка: ${err.response?.data?.message || err.message}`)
        }
    })

    const onFinish = (values) => {
        mutation.mutate(values)
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
                        loading={mutation.isPending}
                    >
                        Tasdiqlash
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default Auth;