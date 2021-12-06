import { useHistory } from 'react-router-dom';
import React from 'react';
import { Button, Table,Spin, Modal, Form, Input, InputNumber } from 'antd';
import {LeftOutlined, LoadingOutlined} from '@ant-design/icons'
import './SearchSignupInfo.css'
import { useEffect } from 'react';
import axios from 'axios';
import url from '../../../server/api/url';
import { useState } from 'react';

const SearchSignupInfo = () => {
    const history = useHistory()
    const [visible, setVisible] = useState(false);      //modal可视化
    const [load, setLoad] = useState(true);
    const [email,setEmail] = useState(''); 
    const [form] = Form.useForm();                      //表单对象
    const [element,setElement] = useState([]);          //数据存放
    const columns = [
        { title: '姓名', dataIndex: 'stu_name'},
        { title: '邮箱', dataIndex: 'stu_email'},
        { title: '学院', dataIndex: 'stu_college'},
        { title: '学号', dataIndex: 'stu_no' },
        { title: '作品链接', dataIndex: 'work_link',
        render:text => <a href={text}>{text}</a>},
        { title: '评价作品', dataIndex: 'comment',
        render:(a,b) => <Button onClick={()=>{handleSetView(b.stu_email)}}>评价</Button>},
    ];

    //获取比赛数据
    useEffect(()=>{
        axios({
            method: "GET",
            url:`${url}/api/v1/setting/competition/user?competition_id=${sessionStorage.getItem('competition_id')}`,
            headers: {
                'token': sessionStorage.getItem('token')
            }
        }).then(data => {
            console.log(data)
            if (data.data.status == 200) {
                const data1 = data.data.data;
                setLoad(false);//把加载中图标取消掉
                setElement(data1);
            }
        }).catch(e => {
            console.log(e)
        })
    },[])

    //设置Modal可视化
    const handleSetView = (email) =>{
        setVisible(true);
        setEmail(email);
    }

    //提交评价信息
    const onOK= () => {
        const value = form .getFieldsValue(true);
        console.log(value)
        axios({
            method:'PUT',
            url:`${url}/api/v1/setting/competition/jugde`,
            headers:{
                token:sessionStorage.getItem('token')
            },
            data:{
                competition_id:parseInt(sessionStorage.getItem('competition_id')),
                email:email,
                status:'',
                comment:value.comment,
                score:value.score,
            }
        }).then( data => {
            console.log(data);
        } ).catch( e => {
            console.log(e);
        } )
    }   
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
                expandedRowRender: record => 
                <div style={{ margin: 0 }}>
                    <p >备注（队员）：{record.remark}</p>
                    <p>评分：{record.score?record.score:''}</p>
                    <p>评语：{record.comment?record.comment:''}</p>
                </div>
                
                }}
                dataSource={element}/>
            }
            
            <Modal 
            width='600px'
            title='评价'
            cancelText={<p>取消</p>}
            okText={<p>提交</p>}
            onOk={onOK}
            onCancel={()=>{setVisible(false)}}
            visible={visible}>
                <Form 
                name='base' 
                labelCol={{span:3}}
                form={form}
                >
                    <Form.Item
                    name="comment"
                    label='评语'
                    >
                    <Input.TextArea/>
                    </Form.Item>

                    <Form.Item
                    name="score"
                    label="分数"
                    rules={[
                        { required: true, message: '请输入得分！' }
                    ]}
                    >
                    <InputNumber min={0} max={100}/>
                    </Form.Item>
                </Form>
            </Modal> 
        </div>
        
    )
}

export default SearchSignupInfo;