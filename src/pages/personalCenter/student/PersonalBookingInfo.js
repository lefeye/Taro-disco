import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PersonalBookingInfo.css'
import url from '../../../server/api/url';
import store from '../../../redux/store'
import 'antd/dist/antd.css';
import { Table, Space, message, Tabs, Button } from 'antd';

export default function PersonalBookingInfo() {
    const [doneData, setDoneData] = useState([]);
    const [todoData, setTodoData] = useState([]);
    const [account, setAccount] = useState(store.getState().userInfo.account);
    const [refresh, setRefresh] = useState(true);
    const { TabPane } = Tabs;

    const callback = (key) => {
        console.log(key);
    }
    const deleteAction = (info) => {
        const URL = url + "/deleteReserve"
        console.log(info)
        axios({
            method: "POST",
            url: URL,
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('token')
            },
            data:
            {
                "account": info.account,
                "lab_name": info.lab_name,
                "seat_name": info.seat_name,
                "reserve_date": info.reserve_date,
                "time_interval": info.time_interval
            }
        }
        ).then(data => {
            console.log(2);
            setRefresh(false);
            console.log(data)
        }).catch(err => {
            console.log(1)
            console.log(err)
        })
    }
    useEffect(() => {
        const URL = url + "/getReserveInfo?limit=50&page=1&account=" + account;
        axios({
            method: "get",
            url: URL,
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then(response => {
                const data = response.data;
                setDoneData(data.done);
                setTodoData(data.todo);
                console.log(2)
            })
            .catch(function (error) {
                console.log(1)
                console.log(error);
            });
        setRefresh(true)
        // console.log(bookingData);
    }, [refresh, account]);

    const confirm = (e) => {
        console.log(e);
        message.success('成功删除');
    }

    const cancel = (e) => {
        console.log(e);
        message.error('放弃删除');
    }

    const columns = [
        {
            title: '学号',
            dataIndex: 'account',
            key: 'account',
        },
        {
            title: '实验室',
            dataIndex: 'lab_name',
            key: 'lab_name',
        },
        {
            title: '座位号',
            dataIndex: 'seat_name',
            key: 'seat_name',
        },
        {
            title: '预约日期',
            dataIndex: 'reserve_date',
            key: 'reserve_date',
        },
        {
            title: '预约时间',
            dataIndex: 'time_interval',
            key: 'time_interval',
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">

                    <Button type='primary' onClick={() => { deleteAction(text) }}>取消预约</Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <h2>个人预约记录</h2>
            <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab="未完成" key="1">
                    <Table columns={columns} dataSource={todoData} />
                </TabPane>
                <TabPane tab="已完成" key="2">
                    <Table columns={columns} dataSource={doneData} />
                </TabPane>

            </Tabs>
        </div>
    );
}
