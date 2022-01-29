import { useHistory } from 'react-router-dom';
import React from 'react';
import { Button, Table,Spin } from 'antd';
import {LeftOutlined, LoadingOutlined} from '@ant-design/icons'
import './SearchSignupInfo.css'
import { useEffect } from 'react';
import url from '../../../server/api/url';
import { useState } from 'react';
import new_axios from '../../../server/api/axios'

const SearchSignupInfo = () => {
    const history = useHistory()
    const [load, setLoad] = useState(true); 
    const [element,setElement] = useState([]);
    const [type,setType] = useState('single');
    useEffect(()=>{
        //获取比赛数据
        new_axios({
            method: "GET",
            url:`${url}/api/v1/setting/contest/signup/get-list?contest_id=${sessionStorage.getItem('competition_id')}`,
        }).then(data => {
            console.log(data)
            if (data.data.code === '200') {
                const data1 = data.data.data;

                if( data.data.data[0].target_type === 'team' ){
                    setType('team')
                }
                console.log(data.data.data[0].target_type);
                setLoad(false);//把加载中图标取消掉
                setElement(data1);
            }
        }).catch(e => {
            console.log(e)
        })
    },[])
    const columns1 = [
        { title: '姓名', dataIndex: ['user','name'], key: 'name' },
        { title: '学号', dataIndex: ['user','account'], key: 'account' },
        { title: '学院', dataIndex: ['user','college'], key: 'college' },
        { title: '邮箱', dataIndex: ['user','email'], key: 'email' },
        { title: '作品链接', dataIndex: 'work_link', key:'5',
            render:(text,record) => 
                <div>
                    {
                        !text?
                        <p>未提交作品</p>:
                        <a  download={record.user.name}>
                        {record.user.name}的作品</a>
                    }
                </div>
        },
        { title: '状态', dataIndex: 'status', key:'7',
            render:text => 
                <div>
                    {
                        text?
                        <p style={{color:"lightgreen"}}>已评价</p>:<p style={{color:"red"}}>未评价</p>
                    }
                </div>
        },
        ];
        const columns2 = [
            { title: '队名', dataIndex: ['team','name'], key: 'name' },
            { title: '联系方式', dataIndex: ['team','email'], key: 'email' },
            { title: '队长', dataIndex: ['team','leader'], key: 'leader' },
            { title: '作品链接', dataIndex: 'work_link', key:'5',
                render:(text,record) => 
                    <div>
                        {
                            !text?
                            <p>未提交作品</p>:
                            <a  download={record.team.name}>
                            {record.team.name}的作品</a>
                        }
                    </div>
            },
            { title: '状态', dataIndex: 'status', key:'7',
                render:text => 
                    <div>
                        {
                            text?
                            <p style={{color:"lightgreen"}}>已评价</p>:<p style={{color:"red"}}>未评价</p>
                        }
                    </div>
            },
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
                    rowKey= { record => record.id } 
                    bordered
                    columns={type === 'single'?columns1:columns2}
                    expandable={{
                    expandedRowRender: record => 
                    <div style={{ margin: 0 }}>
                        <p>评分：{record.score}</p>
                        <p>评语：{record.comment?record.comment:''}</p>
                    </div>
                    }}
                    dataSource={element}/>
                }
                
                
            </div>
            
        )
}

export default SearchSignupInfo;