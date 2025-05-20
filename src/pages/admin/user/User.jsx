import './User.scss'
import React, {useState} from 'react';
import Title from "../../../components/admin/title/Title.jsx";
import {Modal, Table} from "antd";
import {useQuery} from "@tanstack/react-query";
import {tableCols} from "../../../components/admin/table/columns.js";
import Actions from "../../../components/admin/table/Actions.jsx";
import {$adminResp} from "../../../api/apiResp.js";
import {formatPhone} from "../../../assets/scripts/global.js";
import GetFile from "../../../components/get-file/GetFile.jsx";


// fetches
const fetchFilteredData = async ({ queryKey }) => {
    const [, body] = queryKey
    const { data } = await $adminResp.get('/user/all', body)
    return data
}


const User = () => {

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

    const { data } = useQuery({
        queryKey: ['filteredData', body],
        queryFn: fetchFilteredData,
        keepPreviousData: true,
    })
    const user = data?.data


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
                view
                i={i}
            />
        },
    ]


    return (
        <div className="other page">
            <div className="container">
                <Title title='Foydalanuvchilar ~ users'/>
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
                className='main-modal admin-modal user-modal'
                width={888}
                title='Foydalanuvchini korish'
                open={modal !== 'close'}
                onCancel={() => {
                    setModal('close')
                    setSelectedItem(null)
                }}
            >
                <div className="content">
                    <div className="head">
                        <div className="row align-center g1">
                            {/*<GetFile className='img' id={} />*/}
                            <img className='img' src={`data:image/jpeg;base64,${selItem?.photo}`} alt="img"/>
                            <div>
                                <span className='name'>{ selItem?.first_name + ' ' + selItem?.last_name + ' ' + selItem?.patron }</span>
                                <p className="phone">{ formatPhone(selItem?.phone_number) }</p>
                            </div>
                        </div>
                    </div>
                    <div className="body">

                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default User