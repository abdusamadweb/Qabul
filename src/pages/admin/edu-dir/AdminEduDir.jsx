import React, {useEffect, useState} from 'react';
import Title from "../../../components/admin/title/Title.jsx";
import {Button, Form, Input, Modal, Select, Table} from "antd";
import {formatPrice, validateMessages} from "../../../assets/scripts/global.js";
import {addOrEdit, deleteData} from "../../../api/crud.js";
import {useQuery} from "@tanstack/react-query";
import {tableCols} from "../../../components/admin/table/columns.js";
import Actions from "../../../components/admin/table/Actions.jsx";
import {getRequestAdmin, useCrud} from "../../../hooks/useCrud.jsx";


// fetches
const fetchData = () => getRequestAdmin(`/edu-direction/all`)
const fetchEduForm = () => getRequestAdmin(`/edu-form/all`)
const fetchEduLang = () => getRequestAdmin(`/edu-lang/all`)
const fetchType = () => getRequestAdmin(`/ad-type/all`)


const AdminEduDir = () => {

    const [form] = Form.useForm()

    const [modal, setModal] = useState('close')
    const [selectedItem, setSelectedItem] = useState(null)


    // fetch
    const { data, refetch } = useQuery({
        queryKey: ['edu-dir'],
        queryFn: fetchData,
        keepPreviousData: true,
    })
    const { data: eduForm } = useQuery({
        queryKey: ['edu-form'],
        queryFn: fetchEduForm,
        keepPreviousData: true,
        enabled: modal !== 'close',
    })
    const { data: eduLang } = useQuery({
        queryKey: ['edu-lang'],
        queryFn: fetchEduLang,
        keepPreviousData: true,
        enabled: modal !== 'close',
    })
    const { data: type } = useQuery({
        queryKey: ['ad-type'],
        queryFn: fetchType,
        keepPreviousData: true,
        enabled: modal !== 'close',
    })


    // add & edit
    const {
        addOrEditMutation,
        deleteMutation
    } = useCrud('edu-direction', {
        refetch,
        form,
        setModal,
        setSelectedItem,
        addOrEdit,
        deleteData
    })

    const onFormSubmit = (values) => {
        const body = {
            ...values,
        }

        addOrEditMutation.mutate({
            values: body,
            selectedItem
        })
    }

    const deleteItem = (id) => {
        deleteMutation.mutate(id)
    }


    // form
    useEffect(() => {
        if (selectedItem) {
            form.setFieldsValue(selectedItem)
        } else {
            form.resetFields()
        }
    }, [form, selectedItem])


    // table
    const columns = [
        tableCols.id,
        tableCols.nameUz,
        {
            title: "Ta'lim shakli",
            dataIndex: 'edu_form',
            key: 'edu_form',
            render: (_, i) => (
                <span>{ i?.edu_form?.name_uz }</span>
            )
        },
        {
            title: 'Kontract puli',
            dataIndex: 'contract_price',
            key: 'contract_price',
            render: (_, i) => (
                <span>{ formatPrice(i?.contract_price || 0) } sum</span>
            )
        },
        {
            title: "O'quv yili",
            dataIndex: 'year',
            key: 'year',
            render: (_, i) => (
                <span>{ i?.year } yil</span>
            )
        },
        {
            title: "Qabul turi",
            dataIndex: 'year',
            key: 'year',
            render: (_, i) => (
                <span>{ i?.admission_type?.name_uz || i?.admission_type?.name || '_' }</span>
            )
        },
        {
            title: "Yo'nalish kodi",
            dataIndex: 'direction_code',
            key: 'direction_code'
        },
        {
            title: "Imtihon",
            dataIndex: 'exam_name',
            key: 'exam_name'
        },
        {
            ...tableCols.actions,
            render: (_, i) => <Actions
                setModal={setModal}
                setSelectedItem={setSelectedItem}
                deleteItem={deleteItem}
                i={i}
            />
        },
    ]

    const columns2 = [
        tableCols.id,
        tableCols.nameUz,
        tableCols.nameRu,
        tableCols.nameEn,
    ]


    // form fields
    const fields = [
        { name: 'name_uz', label: 'Nomi - uz', type: 'text', required: true },
        { name: 'name_ru', label: 'Nomi - ru', type: 'text', required: true },
        { name: 'name_en', label: 'Nomi - en', type: 'text', required: true },
        { name: 'contract_price', label: 'Kontract puli', type: 'tel', required: true },
        { name: 'year', label: 'O\'quv yili', type: 'tel', required: true },
        { name: 'direction_code', label: 'Yo\'nalish kodi', type: 'tel', required: true },
        { name: 'exam_name', label: 'Imtihon', type: 'text', required: true },
    ]


    return (
        <div className="other page">
            <div className="container">
                <Title
                    title="Ta'lim yo'nalishi"
                    setModal={setModal}
                    btn
                />
                <div className="content">
                    <Table
                        columns={columns}
                        dataSource={data?.data?.map(i => ({
                            ...i,
                            key: i.id,
                        }))}
                        expandable={{
                            expandedRowRender: (record) => (
                                <div className='table-in'>
                                    <p className="title">Ta'lim tili</p>
                                    <Table
                                        size="middle"
                                        columns={columns2}
                                        dataSource={record?.edu_langs}
                                        pagination={false}
                                    />
                                </div>
                            ),
                            rowExpandable: (record) => record.edu_langs,
                        }}
                        scroll={{ x: 750 }}
                    />
                </div>
            </div>
            <Modal
                rootClassName='admin-modal'
                className='main-modal'
                title={modal === 'add' ? "Qo'shish" : "O'zgartirish"}
                open={modal !== 'close'}
                onCancel={() => {
                    setModal('close')
                    setSelectedItem(null)
                }}
                width={600}
            >
                <Form
                    onFinish={onFormSubmit}
                    layout='vertical'
                    validateMessages={validateMessages}
                    form={form}
                >
                    <div className="edu-dir-form">
                        {fields.map((item) => (
                            <Form.Item
                                key={item.name}
                                name={item.name}
                                label={item.label}
                                rules={[{ required: item.required }]}
                            >
                                <Input
                                    placeholder={item.label}
                                    type={item.type}
                                />
                            </Form.Item>
                        ))}

                        <Form.Item
                            name='edu_form_id'
                            label="Ta'lim shakli"
                            rules={[{ required: true }]}
                        >
                            <Select
                                size="large"
                                placeholder="Ta'lim shakli"
                                options={eduForm?.data?.map(i => ({
                                    value: i.id,
                                    label: i.name_uz,
                                }))}
                            />
                        </Form.Item>
                        <Form.Item
                            name='edu_lang_ids'
                            label="Ta'lim tili"
                            rules={[{ required: true }]}
                        >
                            <Select
                                size="large"
                                mode="multiple"
                                placeholder="Ta'lim tili"
                                options={eduLang?.data?.map(i => ({
                                    value: i.id,
                                    label: i.name_uz,
                                }))}
                            />
                        </Form.Item>
                        <Form.Item
                            name='admission_type_id'
                            label="Qabul turi"
                            rules={[{ required: true }]}
                        >
                            <Select
                                size="large"
                                placeholder="Qabul turi"
                                options={type?.map(i => ({
                                    value: i.id,
                                    label: i.name,
                                }))}
                            />
                        </Form.Item>
                    </div>

                    <div className='end mt1'>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size='large'
                            loading={addOrEditMutation?.isPending}
                        >
                            Tasdiqlash
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminEduDir