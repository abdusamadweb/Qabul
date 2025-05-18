import React, {useEffect, useState} from 'react';
import Title from "../../../components/admin/title/Title.jsx";
import {Button, Checkbox, Form, Input, Modal, Table} from "antd";
import {validateMessages} from "../../../assets/scripts/global.js";
import {addOrEdit, deleteData} from "../../../api/crud.js";
import {useQuery} from "@tanstack/react-query";
import {tableCols} from "../../../components/admin/table/columns.js";
import Actions from "../../../components/admin/table/Actions.jsx";
import {getRequest, useCrud} from "../../../hooks/useCrud.jsx";
import {$adminResp} from "../../../api/apiResp.js";


// fetches
const fetchFilteredData = async ({ queryKey }) => {
    const [, body] = queryKey
    const { data } = await $adminResp.post('/admission/all-appointment', body)
    return data
}


const AdminFeed = () => {

    const [form] = Form.useForm()

    const [modal, setModal] = useState('close')
    const [selectedItem, setSelectedItem] = useState(null)


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
            title: 'Tugash sanasi',
            dataIndex: 'user',
            key: 'user',
            render: (_, i) => <span>{ i?.edu_end_date || '_' }</span>
        },
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
                    title='Talim shakli ~ edu-form'
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

export default AdminFeed