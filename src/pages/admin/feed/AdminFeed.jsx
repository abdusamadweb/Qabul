import React, {useEffect, useState} from 'react';
import Title from "../../../components/admin/title/Title.jsx";
import {Button, Form, Modal, Select, Table} from "antd";
import {formatPhone, validateMessages} from "../../../assets/scripts/global.js";
import {useMutation, useQuery} from "@tanstack/react-query";
import {tableCols} from "../../../components/admin/table/columns.js";
import Actions from "../../../components/admin/table/Actions.jsx";
import {$adminResp, $resp} from "../../../api/apiResp.js";
import toast from "react-hot-toast";
import profileImg from "../../../assets/images/profile.jpeg";


// fetches
const fetchFilteredData = async ({ queryKey }) => {
    const [, body] = queryKey
    const { data } = await $adminResp.post('/admission/all-appointment', body)
    return data
}
const fetchOneData = async (id) => {
    const { data } = await $adminResp.get(`/admission/get/${id}`)
    return data
}
const fetchChangeStatus = async (body) => {
    const { data } = await $resp.post('/admission/update-status', body)
    return data
}


const AdminFeed = () => {

    const [form] = Form.useForm()

    const [modal, setModal] = useState('close')
    const [selItem, setSelectedItem] = useState(null)


    // filter data
    const [body, setBody] = useState({
        page: 1,
        limit: 20,
        edu_form_ids: [],
        edu_lang_ids: [],
        edu_direction_ids: []
    })

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['filteredData', body],
        queryFn: fetchFilteredData,
        keepPreviousData: true,
    })

    // get one data
    const { data: oneData, isLoading: oneLoading } = useQuery({
        queryKey: ['one-data', selItem?.id],
        queryFn: () => fetchOneData(selItem?.id),
        keepPreviousData: true,
        enabled: !!selItem
    })
    const one = oneData?.data


    // edit
    const muChangeStatus = useMutation({
        mutationFn: fetchChangeStatus,
        onSuccess: (res) => {
            toast.success(res.message)

            setModal('close')
            setSelectedItem(null)
        },
        onError: (err) => {
            toast.error(`Ошибка: ${err.response?.data?.message || err.message}`)
        }
    })

    const onFormSubmit = (values) => {
        const body = {
            ...values,
            admission_id: selItem?.id
        }

        muChangeStatus.mutate(body)
    }


    // form
    useEffect(() => {
        if (selItem) {
            form.setFieldsValue(selItem)
        } else {
            form.resetFields()
        }
    }, [form, selItem])


    // table
    const columns = [
        tableCols.id,
        {
            title: 'Student',
            dataIndex: 'user',
            key: 'user',
            render: (_, i) => <span>{ i?.user?.first_name + ' ' + i?.user?.last_name }</span>
        },
        {
            title: 'Turi',
            dataIndex: 'admission_type',
            key: 'admission_type',
            render: (_, i) => <span>{ i?.admission_type?.name || '_' }</span>
        },
        {
            title: 'Yonalishi',
            dataIndex: 'edu_direction',
            key: 'edu_direction',
            render: (_, i) => <span>{ i?.edu_direction?.name_uz || '_' }</span>
        },
        {
            title: 'Shakli',
            dataIndex: 'edu_form',
            key: 'edu_form',
            render: (_, i) => <span>{ i?.edu_form?.name_uz || '_' }</span>
        },
        {
            title: 'Tili',
            dataIndex: 'edu_lang',
            key: 'edu_lang',
            render: (_, i) => <span>{ i?.edu_lang?.name_uz || '_' }</span>
        },
        {
            title: 'Bitrgan sanasi',
            dataIndex: 'edu_end_date',
            key: 'edu_end_date',
            render: (_, i) => <span>{ new Date(i?.edu_end_date).getFullYear() || '_' }</span>
        },
        {
            title: 'Amo status',
            dataIndex: 'amo_status',
            key: 'amo_status',
            render: (_, i) => <span>{ i?.amo_status || '_' }</span>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_, i) => <span>{ i?.status || '_' }</span>
        },
        {
            ...tableCols.actions,
            render: (_, i) => <Actions
                setModal={setModal}
                setSelectedItem={setSelectedItem}
                i={i}
                view
            />
        },
    ]


    return (
        <div className="other page">
            <div className="container">
                <Title
                    title='Arizalar ~ addmission'
                    setModal={setModal}
                    btn
                />
                <div className="content">
                    <Table
                        columns={columns}
                        dataSource={data?.data}
                        scroll={{ x: 750 }}
                    />
                </div>
            </div>
            <Modal
                rootClassName='admin-modal'
                className='main-modal'
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
                className='main-modal admin-modal user-modal feed-modal'
                width={600}
                title='Arizani korish'
                open={modal === 'view'}
                loading={oneLoading}
                onCancel={() => {
                    setModal('close')
                    setSelectedItem(null)
                }}
            >
                <div className="head row between g1">
                    <div className="row align-center g1">
                        <img className='img' src={one?.user?.photo ? `data:image/jpeg;base64,${one?.user?.photo}` : profileImg} alt="img"/>
                        <div>
                            <span className='name'>{ one?.user?.first_name + ' ' + one?.user?.last_name + ' ' + one?.user?.patron }</span>
                            <p className="phone">{ formatPhone(one?.user?.phone_number) }</p>
                            <p className="region">{ one?.user?.region }</p>
                            <p className="region">{ new Date(one?.user?.birth_date).toLocaleDateString() }</p>
                        </div>
                    </div>
                    <p className='name id'>ID: {one?.user?.id}</p>
                </div>
                <div className="body">
                    <div className="item">
                        <span className='title'>Qabul turi:</span>
                        <span className='dots'/>
                        <p className="txt">{ one?.admission_type?.name }</p>
                    </div>
                    <div className="item">
                        <span className='title'>Yonalishi:</span>
                        <span className='dots'/>
                        <p className="txt">{ one?.edu_direction?.name_uz }</p>
                    </div>
                    <div className="item">
                        <span className='title'>Talim shakli:</span>
                        <span className='dots'/>
                        <p className="txt">{ one?.edu_form?.name_uz }</p>
                    </div>
                    <div className="item">
                        <span className='title'>Talim tili:</span>
                        <span className='dots'/>
                        <p className="txt">{ one?.edu_lang?.name_uz }</p>
                    </div>
                    <div className="item">
                        <span className='title'>Bitirgan yili:</span>
                        <span className='dots'/>
                        <p className="txt">{ new Date(one?.edu_end_date).getFullYear() }</p>
                    </div>
                    <div className="item">
                        <span className='title'>Amo status:</span>
                        <span className='dots'/>
                        <p className="txt">{ one?.amo_status || '{ null }' }</p>
                    </div>
                    <div className="item">
                        <span className='title'>Shartnoma:</span>
                        <span className='dots'/>
                        <p className="txt">{ one?.contracted ? 'Mavjud' : 'Mavjud emas' }</p>
                    </div>
                    <div className="item">
                        <span className='title'>Sertifikat:</span>
                        <span className='dots'/>
                        {one?.certificate_id ? (
                            <button className="btn">
                                <i className="fa-solid fa-file-arrow-down"/>
                                <span>Yuklash</span>
                            </button>
                        ) : '{ null }'}
                    </div>
                    <Button
                        className="mt1"
                        type='primary'
                        onClick={() => {
                            setModal('edit')
                        }}
                    >
                        Ozgartirish
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default AdminFeed