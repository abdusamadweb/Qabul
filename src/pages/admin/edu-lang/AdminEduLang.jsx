import React, {useEffect, useState} from 'react';
import Title from "../../../components/admin/title/Title.jsx";
import {Button, Checkbox, Form, Input, Modal, Table} from "antd";
import {validateMessages} from "../../../assets/scripts/global.js";
import {addOrEdit, deleteData} from "../../../api/crud.js";
import {useQuery} from "@tanstack/react-query";
import {tableCols} from "../../../components/admin/table/columns.js";
import Actions from "../../../components/admin/table/Actions.jsx";
import {getRequest, useCrud} from "../../../hooks/useCrud.jsx";


// fetches
const fetchData = () => getRequest(`/edu-lang/all`)


const AdminEduLang = () => {

    const [form] = Form.useForm()

    const [modal, setModal] = useState('close')
    const [selectedItem, setSelectedItem] = useState(null)


    // fetch
    const { data, refetch } = useQuery({
        queryKey: ['edu-form'],
        queryFn: fetchData,
        keepPreviousData: true,
    })


    // add & edit
    const {
        addOrEditMutation,
        deleteMutation
    } = useCrud('edu-form', {
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
        tableCols.nameRu,
        tableCols.nameEn,
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
    ]


    return (
        <div className="other page">
            <div className="container">
                <Title
                    title='Talim tili ~ edu-lang'
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
                                    <p className="title">Talim shakli</p>
                                    <Table
                                        size="middle"
                                        columns={columns2}
                                        dataSource={record?.edu_form}
                                        pagination={false}
                                    />
                                </div>
                            ),
                            // rowExpandable: (record) => record.edu_form,
                        }}
                        scroll={{ x: 750 }}
                    />
                </div>
            </div>
            <Modal
                rootClassName='admin-modal'
                className='main-modal'
                title={modal === 'add' ? "Qoshish" : "Ozgartirish"}
                open={modal !== 'close'}
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

export default AdminEduLang