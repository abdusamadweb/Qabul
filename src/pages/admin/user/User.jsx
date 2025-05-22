import './User.scss'
import React, {useState} from 'react';
import Title from "../../../components/admin/title/Title.jsx";
import {Button, Flex, Form, Input, Modal, Radio, Select, Table, Upload} from "antd";
import {useMutation, useQuery} from "@tanstack/react-query";
import {tableCols} from "../../../components/admin/table/columns.js";
import Actions from "../../../components/admin/table/Actions.jsx";
import {$adminResp, $resp} from "../../../api/apiResp.js";
import {formatPhone, uploadProps, validateMessages} from "../../../assets/scripts/global.js";
import profileImg from '../../../assets/images/profile.jpeg';
import toast from "react-hot-toast";
import {BirthDateInput, JshInput, PassportInput} from "../../../components/inputs/Inputs.jsx";


// fetches
const fetchFilteredData = async ({ queryKey }) => {
    const [, body] = queryKey
    const { data } = await $adminResp.get('/user/all', body)
    return data
}

const createUser = async (body) => {
    const { data } = await $adminResp.post('/user/create-user', body)
    return data
}


const User = () => {

    const [form] = Form.useForm()

    const [modal, setModal] = useState('close')
    const [selItem, setSelectedItem] = useState(null)

    const [file, setFile] = useState(null)


    // filter data
    const [body, setBody] = useState({
        page: 1,
        limit: 20,
        edu_form_ids: [],
        edu_lang_ids: [],
        edu_direction_ids: []
    })

    const { data, refetch } = useQuery({
        queryKey: ['filteredData', body],
        queryFn: fetchFilteredData,
        keepPreviousData: true,
    })
    const user = data?.data


    // edit
    const muChangeStatus = useMutation({
        mutationFn: createUser,
        onSuccess: (res) => {
            toast.success(res.message)

            setModal('close')
            setSelectedItem(null)

            refetch()
        },
        onError: (err) => {
            toast.error(`Ошибка: ${err.response?.data?.message || err.message}`)
        }
    })

    const onFormSubmit = (values) => {
        const body = {
            ...values,
            passport_file_id: file ? file?.file.response.files[0].id : null,
        }

        muChangeStatus.mutate(body)
    }


    // table
    const columns = [
        tableCols.id,
        {
            title: 'Ism',
            dataIndex: 'first_name',
            key: 'first_name',
            render: (_, i) => <span>{ i?.first_name || '_' }</span>
        },
        {
            title: 'Familiya',
            dataIndex: 'last_name',
            key: 'last_name',
            render: (_, i) => <span>{ i?.last_name || '_' }</span>
        },
        {
            title: 'Otasini ismi',
            dataIndex: 'patron',
            key: 'patron',
            render: (_, i) => <span>{ i?.patron || '_' }</span>
        },
        {
            title: 'Telefon',
            dataIndex: 'phone_number',
            key: 'phone_number',
            render: (_, i) => <span>{ formatPhone(i?.phone_number) || '_' }</span>
        },
        {
            ...tableCols.actions,
            render: (_, i) => <Actions
                setModal={setModal}
                setSelectedItem={setSelectedItem}
                noEdit
                view
                i={i}
            />
        },
    ]


    return (
        <div className="other page">
            <div className="container">
                <Title
                    title='Foydalanuvchilar ~ users'
                    setModal={setModal}
                    btn
                />
                <div className="content">
                    <Table
                        columns={columns}
                        dataSource={user}
                        scroll={{ x: 750 }}
                    />
                </div>
            </div>

            <Modal
                rootClassName='admin-modal'
                className='main-modal add-user-modal'
                width={600}
                title={modal === 'add' ? "Qoshish" : "Ozgartirish"}
                open={modal === 'add' || modal === 'edit'}
                onCancel={() => {
                    setModal('close')
                    setSelectedItem(null)
                }}
            >
                <Form
                    onFinish={onFormSubmit}
                    layout='vertical'
                    validateMessages={validateMessages}
                    form={form}
                >
                    {modal === 'add' && (
                        <>
                            <div className="wrapper">
                                <Form.Item
                                    name='first_name'
                                    label='Ism'
                                    rules={[{required: true, message: ''}]}
                                >
                                    <Input placeholder='Ism' />
                                </Form.Item>
                                <Form.Item
                                    name='last_name'
                                    label='Familiya'
                                    rules={[{required: true, message: ''}]}
                                >
                                    <Input placeholder='Familiya' />
                                </Form.Item>
                                <Form.Item
                                    name='patron'
                                    label='Otasining ismi'
                                    rules={[{required: true, message: ''}]}
                                >
                                    <Input placeholder='Otasining ismi' />
                                </Form.Item>
                                <Form.Item
                                    name='phone_number'
                                    label='Telefon raqam'
                                    rules={[{required: true, message: ''}]}
                                >
                                    <Input placeholder='Telefon raqam' type='tel' />
                                </Form.Item>
                                <Form.Item
                                    name='passport_id'
                                    label='Passport seriya'
                                    rules={[{required: true, message: 'Toldiring!'}]}
                                >
                                    <PassportInput />
                                </Form.Item>
                                <Form.Item
                                    name='birth_date'
                                    label='Tugilgan sana (yyyy-oo-kk)'
                                    rules={[{required: true, message: 'Toldiring!'}]}
                                >
                                    <BirthDateInput />
                                </Form.Item>
                                <Form.Item
                                    name='passport_expire_date'
                                    label='Amal qilish muddati (yyyy-oo-kk)'
                                    rules={[{required: true, message: 'Toldiring!'}]}
                                >
                                    <BirthDateInput />
                                </Form.Item>
                                <Form.Item
                                    name='jshir'
                                    label='JSHSHIR'
                                >
                                    <JshInput />
                                </Form.Item>
                                <Form.Item
                                    name='givenDate'
                                    label='Berilgan sana (yyyy-oo-kk)'
                                >
                                    <BirthDateInput />
                                </Form.Item>
                                <Form.Item
                                    name='country'
                                    label='Davlat'
                                >
                                    <Input placeholder='Davlat' />
                                </Form.Item>
                                <Form.Item
                                    name='region'
                                    label='Viloyat'
                                >
                                    <Input placeholder='Viloyat' />
                                </Form.Item>
                                <Form.Item
                                    name='district'
                                    label='Tuman'
                                >
                                    <Input placeholder='Tuman' />
                                </Form.Item>
                            </div>
                            <Form.Item
                                name='address'
                                label='Manzil'
                            >
                                <Input.TextArea placeholder='Manzil' />
                            </Form.Item>
                            <Form.Item
                                className='upload'
                                name='passport_file_id'
                                label='Passport fayl'
                                rules={[{required: true, message: ''}]}
                            >
                                <Upload
                                    {...uploadProps}
                                    headers={{
                                        Authorization: `Bearer ${localStorage.getItem('admin-token')}`
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
                            <Form.Item
                                name='gender'
                                label='Jins'
                            >
                                <Radio.Group
                                    options={[
                                        { label: 'Erkak', value: 'Erkak' },
                                        { label: 'Ayol', value: 'Ayol' },
                                    ]}
                                />
                            </Form.Item>

                        </>
                    )}

                    {modal === 'edit' && (
                        <Form.Item
                            name='status'
                            label='Status'
                            rules={[{required: true, message: ''}]}
                        >
                            <Select
                                size='large'
                                placeholder='Status'
                                options={[
                                    { label: 'accepted', value: 'accepted' },
                                    { label: 'rejected', value: 'rejected' },
                                ]}
                            />
                        </Form.Item>
                    )}

                    <div className='end mt1'>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size='large'
                            loading={muChangeStatus?.isPending}
                        >
                            Tasdiqlash
                        </Button>
                    </div>
                </Form>
            </Modal>
            <Modal
                rootClassName='admin-modal'
                className='main-modal admin-modal user-modal'
                width={888}
                title='Foydalanuvchini korish'
                open={modal === 'view'}
                onCancel={() => {
                    setModal('close')
                    setSelectedItem(null)
                }}
            >
                <div className="content">
                    <div className="head row between g1">
                        <div className="row align-center g1">
                            <img className='img' src={selItem?.photo ? `data:image/jpeg;base64,${selItem?.photo}` : profileImg} alt="img"/>
                            <div>
                                <span className='name'>{ selItem?.first_name + ' ' + selItem?.last_name + ' ' + selItem?.patron }</span>
                                <p className="phone">{ formatPhone(selItem?.phone_number) }</p>
                                <p className="region">{ selItem?.region }</p>
                                <p className="region">{ new Date(selItem?.birth_date).toLocaleDateString() }</p>
                            </div>
                        </div>
                        <p className='name id'>ID: {selItem?.id}</p>
                    </div>
                    <div className="body">
                        <div className="item">
                            <span className='title'>Yashash joyi:</span>
                            <p className="txt">{ selItem?.country + ', ' + selItem?.region + ', ' + selItem?.district }</p>
                        </div>
                        <div className="item">
                            <span className='title'>JSHSHIR:</span>
                            <p className="txt">{ selItem?.jshir }</p>
                        </div>
                        <div className="item">
                            <span className='title'>Passport seriya:</span>
                            <p className="txt">{ selItem?.passport_id }</p>
                        </div>
                        <div className="item">
                            <span className='title'>Royxatdan otgan sana:</span>
                            <p className="txt">{ new Date(selItem?.created_at).toLocaleDateString() }</p>
                        </div>
                        <div className="item">
                            <span className='title'>State:</span>
                            <p className="txt">{ selItem?.state || '{ null }' }</p>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default User