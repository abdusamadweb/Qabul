import React, {useEffect, useMemo, useState} from 'react'
import Title from "../../../components/admin/title/Title.jsx"
import {Button, Form, Image, Input, Modal, Pagination, Select, Table, Upload} from "antd"
import {formatPhone, uploadProps, validateMessages} from "../../../assets/scripts/global.js"
import {useMutation, useQuery} from "@tanstack/react-query"
import {tableCols} from "../../../components/admin/table/columns.js"
import Actions from "../../../components/admin/table/Actions.jsx"
import {$adminResp, $resp} from "../../../api/apiResp.js"
import toast from "react-hot-toast"
import profileImg from "../../../assets/images/profile.jpeg"


// fetches
const fetchFilteredData = async (body) => {
    const { data } = await $adminResp.post(`/admission/all-appointment`, body)
    return data
}
const fetchOneData = async (id) => {
    const { data } = await $adminResp.get(`/admission/get/${id}`)
    return data
}
const fetchChangeStatus = async (body) => {
    const { data } = await $adminResp.post('/admission/update-status', body)
    return data
}
const fetchAddStatus = async (body) => {
    const { data } = await $adminResp.post('/admission/create-admission', body)
    return data
}

const fetchTypes = async () => {
    const { data } = await $adminResp.get('/ad-type/all')
    return data
}
const fetchIns = async () => {
    const { data } = await $adminResp.get('/admission/edu-institution')
    return data
}
const fetchForm = async () => {
    const { data } = await $adminResp.get('/edu-form/all')
    return data
}
const fetchLang = async () => {
    const { data } = await $adminResp.get('/edu-lang/all')
    return data
}
const fetchDirection = async () => {
    const { data } = await $adminResp.get('/edu-direction/all')
    return data
}

const downloadFile = async (id) => {
    try {
        const response = await $resp.post(`/admission/download-contract/`, {
            responseType: 'blob',
        });

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `document-${id}.pdf`); // или любое имя файла
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Ошибка при скачивании PDF:', error);
        toast.error('PDF faylni yuklab bo‘lmadi');
    }
}


// debounce search
function debounce(func, wait) {
    let timeout
    return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
    }
}


const AdminFeed = () => {

    const [form] = Form.useForm()

    const [modal, setModal] = useState('close')
    const [selItem, setSelectedItem] = useState(null)

    const [file, setFile] = useState(null)


    // filter data
    const [body, setBody] = useState({
        page: 1,
        limit: 40,
        search: '',
        edu_form_ids: [],
        edu_lang_ids: [],
        edu_direction_ids: []
    })

    const { data, refetch, isLoading } = useQuery({
        queryKey: ['feeds', JSON.stringify(body)],
        queryFn: () => fetchFilteredData(body),
        keepPreviousData: true,
    })

    const handleSelectChange = (value, type) => {
        setBody(prev => ({
            ...prev,
            [type]: value ? [value] : [],
        }))
    }

    // get one data
    const { data: oneData, isLoading: oneLoading } = useQuery({
        queryKey: ['one-data', selItem?.id],
        queryFn: () => fetchOneData(selItem?.id),
        keepPreviousData: true,
        enabled: !!selItem
    })
    const one = oneData?.data


    const [searchTerm, setSearchTerm] = useState('')
    const [searchQuery, setSearchQuery] = useState('')

    const debouncedSearch = useMemo(() => debounce((val) => {
        if (val.length >= 3) setSearchQuery(val)
    }, 400), [])

    const fetchUsers = async ({ queryKey }) => {
        const [_key, search] = queryKey

        const params = search && search.length >= 3
            ? { search }
            : {}; // hech narsa bermasa, umumiy ro‘yxat

        const { data } = await $adminResp.get('/user/all', { params })
        return data
    }

    const handleSearch = (val) => {
        setSearchTerm(val);
        if (!val) {
            setSearchQuery(''); // tozalanganda umumiy userlar ko‘rsatiladi
        } else {
            debouncedSearch(val);
        }
    }

    const { data: user, isFetching } = useQuery({
        queryKey: ['users', searchQuery],
        queryFn: fetchUsers,
        enabled: modal === 'add', // faqat 3 harfdan keyin ishga tushadi
        keepPreviousData: true
    })

    const { data: types } = useQuery({
        queryKey: ['types'],
        queryFn: fetchTypes,
        keepPreviousData: true,
        enabled: modal === 'add'
    })
    const { data: ins } = useQuery({
        queryKey: ['edu-ins'],
        queryFn: fetchIns,
        keepPreviousData: true,
        enabled: modal === 'add'
    })
    const { data: eform } = useQuery({
        queryKey: ['edu-form'],
        queryFn: fetchForm,
        keepPreviousData: true,
    })
    const { data: lang } = useQuery({
        queryKey: ['edu-lang'],
        queryFn: fetchLang,
        keepPreviousData: true,
    })
    const { data: dir } = useQuery({
        queryKey: ['edu-dir'],
        queryFn: fetchDirection,
        keepPreviousData: true,
    })


    // edit
    const muChangeStatus = useMutation({
        mutationFn: (body) => modal === 'add'
            ? fetchAddStatus(body)
            : fetchChangeStatus(body),
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
            passport_file_id: file ? file?.file.response.files[0].id : null
        }
        const edit = {
            ...values,
            admission_id: selItem?.id
        }

        muChangeStatus.mutate(modal === 'add' ? body : edit)
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


    // selects
    const [selectedFormId, setSelectedFormId] = useState(null)
    const [selectedLangId, setSelectedLangId] = useState(null)

    const handleFormChange = (value) => {
        setSelectedFormId(value)
        setSelectedLangId(null)

        // 👇 Обязательно сбросить значения select-ов в форме
        form.setFieldsValue({
            edu_lang_id: null,
            edu_direction_id: null,
        })
    }

    const handleLangChange = (value) => {
        setSelectedLangId(value)

        form.setFieldsValue({
            edu_direction_id: null,
        })
    }

    const filteredLangs = lang?.data?.filter(lang =>
        lang.edu_form_ids.includes(selectedFormId)
    )

    const filteredDirections = dir?.data?.filter(dir =>
        dir.edu_lang_ids.includes(selectedLangId)
    )


    // генерируем список годов от текущего до (текущий год - 40)
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 40 }, (_, i) => ({
        value: currentYear - i,
        label: currentYear - i,
    }))


    return (
        <div className="other page">
            <div className="container">
                <Title
                    title='Arizalar'
                    setModal={setModal}
                    btn
                />
                <div className="content">
                    <div className="filters row g10">
                        <Input.Search
                            size='large'
                            allowClear
                            placeholder="Qidirish . . ."
                            onSearch={(value) => {
                                setBody(prev => ({ ...prev, search: value }))
                                refetch()
                            }}
                            style={{ width: 333 }}
                        />
                        <Select
                            size='large'
                            placeholder="Ta'lim shaklini tanlang"
                            onChange={(val) => handleSelectChange(val, 'edu_form_ids')}
                            options={[
                                {label: "Tanlanmagan", value: null},
                                ...(Array.isArray(eform?.data) ? eform.data.map(i => ({
                                    label: i.name_uz,
                                    value: i.id
                                })) : [])
                            ]}
                        />
                        <Select
                            size='large'
                            placeholder="Ta'lim tilini tanlang"
                            onChange={(val) => handleSelectChange(val, 'edu_lang_ids')}
                            options={[
                                {label: "Tanlanmagan", value: null},
                                ...(Array.isArray(lang?.data) ? lang.data.map(i => ({
                                    label: i.name_uz,
                                    value: i.id
                                })) : [])
                            ]}
                        />
                        <Select
                            size='large'
                            placeholder="Ta'lim yonalishini tanlang"
                            onChange={(val) => handleSelectChange(val, 'edu_direction_ids')}
                            options={[
                                {label: "Tanlanmagan", value: null},
                                ...(Array.isArray(dir?.data) ? dir.data.map(i => ({
                                    label: i.name_uz,
                                    value: i.id
                                })) : [])
                            ]}
                        />
                    </div>
                    <Table
                        columns={columns}
                        dataSource={data?.data}
                        rowKey="id"
                        pagination={false}
                        loading={isLoading}
                        scroll={{x: 750}}
                    />
                    <Pagination
                        align='end'
                        current={body.page}
                        total={data?.total}
                        pageSize={body.limit}
                        onChange={(page, pageSize) => {
                            setBody(prev => ({
                                ...prev,
                                page,
                                limit: pageSize,
                            }));
                            window.scrollTo(0, 0);
                        }}
                    />
                </div>
            </div>
            <Modal
                rootClassName='admin-modal'
                className='main-modal'
                width={modal === 'add' ? 666 : 444}
                title={modal === 'add' ? "Q'oshish" : "O'zgartirish"}
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
                                    {label: 'accepted', value: 'accepted'},
                                    {label: 'rejected', value: 'rejected'},
                                ]}
                            />
                        </Form.Item>
                    )}

                    {modal === 'add' && (
                        <div className='grid grid-wrapper'>
                            <Form.Item
                                name="user_id"
                                label="Foydalanuvchilar"
                                rules={[{ required: true, message: '' }]}
                            >
                                <Select
                                    showSearch
                                    size="large"
                                    placeholder="Foydalanuvchini tanlang"
                                    notFoundContent={isFetching ? 'Yuklanmoqda...' : 'Topilmadi'}
                                    onSearch={handleSearch}
                                    filterOption={false}
                                    options={user?.data?.map(i => ({
                                        label: `${i.first_name} ${i.last_name} ${i.patron || ''}`,
                                        value: i.id,
                                    }))}
                                />
                            </Form.Item>
                            <Form.Item
                                name='admission_type_id'
                                label='Qabul turi'
                                rules={[{required: true, message: ''}]}
                            >
                                <Select
                                    size='large'
                                    placeholder='Qabul turini tanlang'
                                    options={types?.map(i => ({
                                        label: i.name,
                                        value: i.id
                                    }))}
                                />
                            </Form.Item>
                            <Form.Item
                                name='edu_ins_id'
                                label="Ta'lim muassasasi"
                                rules={[{required: true, message: ''}]}
                            >
                                <Select
                                    size='large'
                                    placeholder="Ta'lim muassasasini tanlang"
                                    options={ins?.data?.map(i => ({
                                        label: i.name_uz,
                                        value: i.id
                                    }))}
                                />
                            </Form.Item>
                            <Form.Item
                                name='edu_end_date'
                                label='Bitirgan yili'
                                rules={[{required: true, message: ''}]}
                            >
                                <Select
                                    size='large'
                                    placeholder='Bitirgan yilini tanlang'
                                    options={years}
                                />
                            </Form.Item>
                            <Form.Item
                                name='edu_form_id'
                                label="Ta'lim shakli"
                                rules={[{required: true, message: ''}]}
                            >
                                <Select
                                    size='large'
                                    placeholder="Ta'lim shaklini tanlang"
                                    onChange={handleFormChange}
                                    options={eform?.data?.map(i => ({
                                        label: i.name_uz,
                                        value: i.id
                                    }))}
                                />
                            </Form.Item>
                            <Form.Item
                                name='edu_lang_id'
                                label="Ta'lim tili"
                                rules={[{required: true, message: ''}]}
                            >
                                <Select
                                    size='large'
                                    placeholder="Ta'lim tilini tanlang"
                                    onChange={handleLangChange}
                                    disabled={!selectedFormId}
                                    options={filteredLangs?.map(i => ({
                                        label: i.name_uz,
                                        value: i.id
                                    }))}
                                />
                            </Form.Item>
                            <Form.Item
                                name='edu_direction_id'
                                label="Ta'lim yonalishi"
                                rules={[{required: true, message: ''}]}
                            >
                                <Select
                                    size='large'
                                    placeholder="Ta'lim yonalishini tanlang"
                                    disabled={!selectedLangId}
                                    options={filteredDirections?.map(i => ({
                                        label: i.name_uz,
                                        value: i.id
                                    }))}
                                />
                            </Form.Item>
                            <Form.Item
                                className='upload'
                                name='certificate_id'
                                label='Sertifikat fayl'
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
                        </div>
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
                className='main-modal admin-modal user-modal feed-modal'
                width={600}
                title="Arizani ko'rish"
                open={modal === 'view'}
                loading={oneLoading}
                onCancel={() => {
                    setModal('close')
                    setSelectedItem(null)
                }}
            >
                <div className="head row between g1">
                    <div className="row align-center g1">
                        <Image className='img' src={one?.user?.photo ? `data:image/jpeg;base64,${one?.user?.photo}` : profileImg} alt="img"/>
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
                        <span className='title'>Ta'lim shakli:</span>
                        <span className='dots'/>
                        <p className="txt">{ one?.edu_form?.name_uz }</p>
                    </div>
                    <div className="item">
                        <span className='title'>Ta'lim tili:</span>
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
                        <p className="txt">{ one?.amo_status || "yo'q" }</p>
                    </div>
                    <div className="item">
                        <span className='title'>Shartnoma:</span>
                        <span className='dots'/>
                        <p className="txt">{ one?.contracted ? 'Mavjud' : 'Mavjud emas' }</p>
                    </div>
                    <div className="item">
                        <span className='title'>Shartnoma fayl:</span>
                        <span className='dots'/>
                        <button className="btn" onClick={downloadFile}>Yuklash <i className="fa-solid fa-download"/></button>
                    </div>
                    <div className="item">
                        <span className='title'>Sertifikat:</span>
                        <span className='dots'/>
                        {one?.certificate_id ? (
                            <button className="btn">
                                <i className="fa-solid fa-file-arrow-down"/>
                                <span>Yuklash</span>
                            </button>
                        ) : "yo'q"}
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
    )
}

export default AdminFeed