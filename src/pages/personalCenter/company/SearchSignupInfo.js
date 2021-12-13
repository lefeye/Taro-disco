import { useHistory } from 'react-router-dom';
import React from 'react';
import { Button, Table,Spin, Modal, Form, Input, InputNumber, message } from 'antd';
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
    const [submit,setSubmit] = useState(false);         //提交评价时禁用按钮
    const [email,setEmail] = useState('');              //存放正在点击的用户的email
    const [form] = Form.useForm();                      //表单对象
    const [element,setElement] = useState([]);          //数据存放
    const columns = [
        { title: '姓名', dataIndex: 'stu_name', key:'1'},
        { title: '邮箱', dataIndex: 'stu_email', key:'2'},
        { title: '学院', dataIndex: 'stu_college', key:'3'},
        { title: '学号', dataIndex: 'stu_no', key:'4'},
        { title: '作品链接', dataIndex: 'work_link', key:'5',
            render:(text,record) => 
                <div>
                    {
                        text.indexOf('null')!==-1?
                        <p>未提交作品</p>:
                        <a onClick = { () => { loadFile(text) } } download={record.stu_name}>
                        {record.stu_name}的作品</a>
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
        { title: '评价作品', dataIndex: 'comment',key:'6',
        render:(a,b) => <Button onClick={()=>{handleSetView(b.stu_email)}}>评价</Button>},
    ];

    //下载文件
    const loadFile = url => {
        let Url=`http://${url}`
        window.open(Url,'_blank');
    }

    //获取比赛数据
    useEffect(()=>{
        axios({
            method: "GET",
            url:`${url}/api/v1/setting/competition/user?competition_id=${sessionStorage.getItem('competition_id')}`,
            headers: {
                'token': sessionStorage.getItem('token')
            }
        }).then(data => {
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
        setSubmit(true);
        axios({
            method:'PUT',
            url:`${url}/api/v1/setting/competition/judge`,
            headers:{
                token:sessionStorage.getItem('token')
            },
            data:{
                competition_id:parseInt(sessionStorage.getItem('competition_id')),
                email:email,
                status:'1',
                comment:value.comment,
                score:value.score,
            }
        }).then( data => {
            if(data.data.status==='200'){
                message.info('评价已上传，如想查看评价后的状态请刷新页面');
                //window.location.reload();
                setVisible(false);
                setSubmit(false)
            }
            else {
                message.error(data.data.msg);
            }
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
                rowKey= 'stu_email'
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
            confirmLoading={submit}
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
                    <InputNumber min={0} max={100} placeholder='0~100'/>
                    </Form.Item>
                    <Form.Item
                    name="beizhu"
                    label='*注'
                    >
                    <p>第二次评价会修改之前的评价</p>
                    </Form.Item>
                </Form>
            </Modal> 
        </div>
        
    )
}

export default SearchSignupInfo;