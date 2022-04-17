import React, { useState, useEffect } from 'react';
import url from '../../../server/api/url';
import axios from 'axios';
import { Table, Space, message, Input, Button } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import './Alluser.css'
export default function Alluser() {
    const [allUser, setAllUser] = useState([]);
    const [refresh, setRefresh] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [searchInput, setSearchInput] = useState()
    const URL = url + `/findAllUser?limit=50&page=1`
    useEffect(() => {
        axios({
            method: "get",
            url: URL,
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then(response => {
                // console.log(response.data)
                if (response.data.code === 'BS2003') {
                    setAllUser(response.data.data);
                    console.log(response.data.data)
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        setRefresh(true);
    }, [refresh])

    const changeIdentity = (oldUser) => {
        const role = oldUser['role_id']
        const add = role == '666666' ? `/turnToAdmin` : `/turnToUser`;
        const URL = url + add;
        axios({
            method: "POST",
            url: URL,
            data: {
                "account": oldUser.account,
            },
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('token')
            }
        }

        ).then(data => {
            if (data.data.status == 'BS2018')
                message.success('角色已切换为管理员')
            else {
                if (data.data.status == 'BS2019')
                    message.success('角色已切换为普通用户')
                else
                    message.error('角色切换失败，网络出错')
            }
            setRefresh(false)
        }).catch(err => {
            message.error('请求失败，请稍后再试')
            console.log(err)
        })
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        console.log(selectedKeys)
        console.log(confirm)
        console.log(dataIndex)
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex)

    };

    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = dataIndex => ({
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
                            setSearchedColumn(dataIndex);
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
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.select(), 100);
            }
        },
        render: text =>
            (dataIndex) ?
                setSearchedColumn(
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[...searchText]}
                        autoEscape
                        textToHighlight={text ? text.toString() : ''}
                    />
                ) : setSearchedColumn(text)
    });
    const columns = [
        {
            title: '学号',
            dataIndex: 'account',
            key: 'account',
            // ...getColumnSearchProps('account')
        },
        {
            title: '姓名',
            dataIndex: 'Name',
            key: 'Name',
            // ...getColumnSearchProps('Name')
        },
        {
            title: '邮箱',
            dataIndex: 'Email',
            key: 'Email',
        },
        {
            title: '联系方式',
            dataIndex: 'Telephone',
            key: 'Telephone',
        },
        {
            title: '职业',
            dataIndex: 'Identity',
            key: 'Identity',
            render: (identity) => (
                <p>{identity == 'teacher' ? '老师' : '学生'}</p>
            )
        },
        {
            title: '身份',
            dataIndex: 'role_id',
            key: 'role_id',
            render: (role_id) => (
                <p>{role_id == '666666' ? '普通用户' : '管理员'}</p>
            )
        },
        {
            title: '角色管理',
            key: 'action',
            render: (user) => (
                <Space size="middle">
                    {user.account === '201820220001' ? (
                        <Button type="text" className='superAdmin'>超级管理员</Button>)
                        : <Button type="primary" onClick={() => { changeIdentity(user) }}> 转换角色 </Button>}
                </Space>
            ),
        },
    ];
    return <div>
        <h2 className='header'>用户信息</h2>
        <Table
            columns={columns}
            dataSource={allUser}
            pagination={10}
            style={{ width: '90%', margin: 'auto' }} />
    </div>;
}
