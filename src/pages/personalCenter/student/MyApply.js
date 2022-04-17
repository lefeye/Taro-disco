import React, { useState, useEffect } from 'react'
import url from '../../../server/api/url';
import store from '../../../redux/store';
import axios from 'axios';
import { Descriptions } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import './MyApply.css'
// import MyApply from './../company/AllApply';
export default function MyApply() {
    const account = useState(store.getState().userInfo.account);
    const [refresh, setRefresh] = useState(false);
    const [applyInfo, setApplyInfo] = useState([]);
    useEffect(() => {
        const URL = url + "/getPersonalApply?limit=10&page=1&account=" + account[0];
        axios({
            method: "get",
            url: URL,
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then(response => {
                const data = response.data.data;
                setApplyInfo(data)
                console.log(response.data)
            })
            .catch(function (error) {
                console.log(error);
            });
        setRefresh(true)
    }, [refresh])
    return (

        <div>{applyInfo.length !== 0 ?
            applyInfo.map(item => {
                return <div className='description'>
                    <Descriptions className='left'>
                        <Descriptions.Item label="申请人">{item.user_name}</Descriptions.Item>
                        <Descriptions.Item label="预约实验室">{item.lab_name}</Descriptions.Item>
                        <Descriptions.Item label="预约时间">{item.reserve_date}</Descriptions.Item>
                        {/* <Descriptions.Item label="" className='zt'>{item.status == '0' ? '申请审核中' : item.status == '1' ? '申请通过' : '申请被拒绝'}</Descriptions.Item> */}
                    </Descriptions>
                    <div className={item.status == '0' ? 'status' : item.status == '1' ? 'pass' : 'refuse'}>
                        {item.status == '0' ? '申请审核中' : item.status == '1' ?
                            <>申请通过 <CheckCircleOutlined twoToneColor="#52c41a" /></> :
                            <>申请被拒绝 <CloseCircleOutlined twoToneColor="#eb2f96" /></>}</div>
                </div>
            })
            : <h2>当前无申请记录</h2>}
        </div>
    )
}
