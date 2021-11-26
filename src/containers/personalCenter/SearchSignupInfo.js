import { useHistory } from 'react-router-dom';
import React from 'react';
import { Button, Table,Spin } from 'antd';
import {LeftOutlined, LoadingOutlined} from '@ant-design/icons'
import './SearchSignupInfo.css'
import { useEffect } from 'react';
import axios from 'axios';
import url from '../../server/api/url';
import { useState } from 'react';

const SearchSignupInfo = () => {
    const history = useHistory()
    const [load, setLoad] = useState(true); 
    const [element,setElement] = useState([]);

    useEffect(()=>{
        //获取比赛数据
        axios({
            method: "GET",
            url:`${url}/api/v1/setting/competition/user?competition_id=${localStorage.getItem('competition_id')}`,
            headers: {
                'token': localStorage.getItem('token')
            }
        }).then(data => {
            if (data.data.status === 200) {
                const data1 = data.data.data;
                setLoad(false);//把加载中图标取消掉
                setElement(data1);
            }
        }).catch(e => {
            console.log(e)
        })
    },[])
    const columns = [
        { title: '姓名', dataIndex: 'name', key: 'name' },
        { title: '邮箱', dataIndex: 'email', key: 'email' },
        { title: '学院', dataIndex: 'college', key: 'college' },
        { title: '学号', dataIndex: 'number', key: 'number' },
        { title: '作品链接', dataIndex: 'work_link', key: 'work_link' },
        ];
        
        const spin = (<LoadingOutlined style={{ fontSize: 24 }} spin />);
        
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
                {
                    load?<Spin indicator={spin} tip='loading' style={{margin:'0 50%'}}/>:

                    <Table 
                    rowKey= 'email'
                    bordered
                    columns={columns}
                    expandable={{
                    expandedRowRender: record => <p style={{ margin: 0 }}>备注（队员）：{record.remark}</p>
                    }}
                    dataSource={element}/>
                }
                
                
            </div>
            
        )
}

export default SearchSignupInfo;