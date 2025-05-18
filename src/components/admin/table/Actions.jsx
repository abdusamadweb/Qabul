import React from 'react';
import {Popconfirm} from "antd";

const Actions = ({ i, setModal, setSelectedItem, deleteItem, view }) => {

    return (
        <div className="actions">
            {
                view ?
                    <button className='actions__btn view' onClick={() => {
                        setModal('view')
                        setSelectedItem(i)
                    }}>
                        <i className="fa-solid fa-eye"/>
                    </button>
                    :
                    <button className='actions__btn edit' onClick={() => {
                        setModal('edit')
                        setSelectedItem(i)
                    }}>
                        <i className="fa-regular fa-pen-to-square"/>
                    </button>
            }

            <Popconfirm
                title="Ochirishni xolisizmi?"
                description=' '
                okText="Ha"
                cancelText="Yoq"
                placement='topRight'
                onConfirm={() => deleteItem(i.id)}
            >
                <button className='actions__btn delete'>
                    <i className="fa-regular fa-trash-can"/>
                </button>
            </Popconfirm>
        </div>
    );
};

export default Actions;