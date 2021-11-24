import { useHistory } from 'react-router-dom';
import React from 'react';
import { Button, Table } from 'antd';
import {LeftOutlined} from '@ant-design/icons'
import './SearchSignupInfo.css'
import { useEffect } from 'react';
import axios from 'axios';
import url from '../../server/api/url';
import { useState } from 'react';

const SearchSignupInfo = () => {
    const history = useHistory()
    const [data1,setData] = useState([])
    useEffect( () => {
        axios({
            method:"GET",
            url:`${url}/api/v1/setting/competition/user?competition_id=${localStorage.getItem('competition_id')}`,
            headers:{
                'token':localStorage.getItem('token')
            }
        }).then( response => {
            try{
                if(response.data.status===200){
                setData(response.data.data)
                console.log(data1);
                }
            }
            catch (e) {
                console.log(e)
            }
            
            
        }).catch( e =>{
            console.log(e);
        })
    } )
    const columns = [
        { title: '姓名', dataIndex: 'name', key: 'name' },
        { title: '邮箱', dataIndex: 'email', key: 'email' },
        { title: '学院', dataIndex: 'college', key: 'college' },
        { title: '学号', dataIndex: 'number', key: 'number' },
        { title: '作品链接', dataIndex: 'work_link', key: 'work_link' },
        ];
    
        const data = [
        {
            key: 1,
            name: 'John Brown',
            email: 32,
            college: 'New York No. 1 Lake Park',
            description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
        },
        {
            key: 2,
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
        },
        {
            key: 3,
            name: 'Not Expandable',
            age: 29,
            address: 'Jiangsu No. 1 Lake Park',
            description: 'This not expandable',
        },
        {
            key: 4,
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
            description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.',
        },
        
        ];
    
        return (
            <div className='signUpTable'>
                <Button 
                onClick={ ()=>{ history.goBack() } } 
                type='link' 
                icon={<LeftOutlined />}
                >
                    返回上一级 
                </Button>
                <h2>参赛人员列表</h2>
                <Table 
                bordered
                columns={columns}
                expandable={{
                expandedRowRender: record => <p style={{ margin: 0 }}>{record.description}</p>,
                rowExpandable: record => record.name !== 'Not Expandable',
                }}
                dataSource={data}
                />
            </div>
            
        )
}

export default SearchSignupInfo;