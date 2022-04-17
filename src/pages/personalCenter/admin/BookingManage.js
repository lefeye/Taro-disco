import './BookingManage.css';
import React, { useState, useEffect } from "react";
import 'moment/locale/zh-cn';

import { Table, Space, Button, Input, Tabs } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import '../../../server/api/dateChange'
import url from '../../../server/api/url';

const BookingManage = () => {
    const URL = url + `/getAllReserveInfo?limit=50&page=1`
    const [doneData, setDoneData] = useState([]);
    const [todoData, setTodoData] = useState([]);
    const [refresh, setRefresh] = useState(true);
    const [searchedColumn, setSearchedColumn] = useState('');
    const [searchText, setSearchText] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const { TabPane } = Tabs;

    const callback = (key) => {
        console.log(key);
    }
    useEffect(() => {
        axios({
            method: "get",
            url: URL,
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then(response => {
                console.log(response.data)
                if (response.data.status === 'BS2020') {
                    if (response.data.done)
                        setDoneData(response.data.done);
                    if (response.data.todo)
                        setTodoData(response.data.todo);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [refresh])

    const deleteAction = (info) => {
        const URL = url + "/deleteReserve"
        //加弹窗
        console.log(info)
        axios({
            method: "POST",
            url: URL,
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('token')
            },
            data: {
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

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0])
        setSearchedColumn(dataIndex);
    };

    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        setSearchInput(node);
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText(selectedKeys[0])
                            setSearchedColumn(dataIndex)

                        }}
                    >
                        Filter
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        // onFilterDropdownVisibleChange: visible => {
        //     if (visible) {
        //         setTimeout(() => searchInput.select(), 100);
        //     }
        // },
        render: text =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[...searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    })
    const columns1 = [
        {
            title: '学号',
            dataIndex: 'account',
            key: 'account',
        },
        {
            title: '实验室',
            dataIndex: 'lab_name',
            key: 'lab_name',
            ...getColumnSearchProps('lab_name')
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
            ...getColumnSearchProps('reserve_date')
        },
        {
            title: '预约时间',
            dataIndex: 'time_interval',
            key: 'time_interval',
            ...getColumnSearchProps('time_interval')
        },
    ];
    const columns2 = [
        ...columns1,
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type='primary' onClick={() => { deleteAction(text) }}>拒绝预约</Button>
                </Space>
            ),
        },
    ];


    return (
        <div>
            <h2 className='title1'>预约记录</h2>
            <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab="未完成" key="1">
                    <Table
                        columns={columns2}
                        dataSource={todoData}
                        style={{ width: '90%', margin: 'auto' }}
                    />
                </TabPane>
                <TabPane tab="已完成" key="2">
                    <Table
                        columns={columns1}
                        dataSource={doneData}
                        style={{ width: '90%', margin: 'auto' }} />
                </TabPane>

            </Tabs>
        </div>
    )
}

export default BookingManage;