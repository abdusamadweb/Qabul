import React, {useEffect, useState} from 'react'
import {Spin} from "antd"

const Loader = ({ setLoading }) => {

    const [visible, setVisible] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setVisible(false)
            setTimeout(() => setLoading(false), 600)
        }, 1000)
    }, [setLoading])


    return (
        <div className={`loader grid-center ${!visible ? "hidden" : ""}`}>
            <Spin size="large"/>
        </div>
    );
};

export default Loader;