// import axios from 'axios';
import axios from '../../server/api/axios'
import React, { useState, useEffect } from 'react';
import url from '../../server/api/url'
import './Information.css'
import {
    Form,
    Button,
    Popover,
    Descriptions,
    Input,
    message,
} from 'antd'

let info 
function Info() {
    const [user, setUser] = useState({});
    const [oldPassword,setOldPassword]=useState('')
    const [newPassword,setNewPassword]=useState('')
    const [form] = Form.useForm();
    const [state, setState] = useState(1);  //加载中
    const [role,setRole] = useState({})
    useEffect( () =>{
        axios({
            method: "GET",
            url: `${url}/api/v1/get-info`,
        }).then(data => {
            if (data.data.code === '200') {
                console.log(data.data.data.role)
                setRole(data.data.data.role)
                const userInformation = data.data.data;
                info=userInformation;
                sessionStorage.setItem('account',userInformation.account);
                sessionStorage.setItem('email',userInformation.email);
                sessionStorage.setItem('identity',userInformation.identity);
                setUser(userInformation);
                form.setFieldsValue({
                    account:userInformation.account,
                    email:userInformation.email,
                    telephone:userInformation.telephone,
                    grade:userInformation.grade,
                    degree:userInformation.degree,
                    college:userInformation.college,
                    name:userInformation.name
                })
            }
            else {
                message.error('查询个人信息失败！')
            }
        }).catch(e => {
            console.log(e);
        })
    } ,[])
    
    const submitInfo = (userInformation) => {
        axios(
            {
                method:'PUT',
                url:`${url}/api/v1/user/update-info`,
                data:{
                    account:userInformation.account,
                    email:userInformation.email,
                    telephone:userInformation.telephone,
                    grade:userInformation.grade,
                    degree:userInformation.degree,
                    college:userInformation.college,
                    name:userInformation.name
                }
                
        }).then( data => {
            message.info(data.data.msg)
            setState(1);
            
        } ).then( () =>{
            setTimeout(()=>{window.location.reload()}, 200)
            
            //window.location.reload()
         }).catch( e => {
             message.error(e.response.data.msg);
         } )
    }
    const formItemLayout = {
        labelCol: {
          xs: { span: 16 },
          sm: { span: 2 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
      };
    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
            span: 24,
            offset: 0,
            },
            sm: {
            span: 8,
            offset: 4,
            },
        },
    };
    const oldPass = (e) => {
        setOldPassword(e.target.value);
    }
    const newPass = (e) => {
        setNewPassword(e.target.value);
    }
    const handleSubmitPassword = () => {
        axios({
            method:'PUT',
            url:`${url}/api/v1/user/update-password`,
            data:{
                old_password:oldPassword,
                new_password:newPassword
            }
        }).then( data => {
            message.info(data.data.msg);
        } ).catch( e => {
            message.error(e.response.data.msg);
        })
    }
    const content=(
        <div style={{width:'150px'}}>
            <Input.Password placeholder='原密码'style={{marginBottom:'10px'}} onChange={oldPass}/>
            <Input.Password placeholder='新密码'style={{marginBottom:'10px'}} onChange={newPass}/>
            <Button type='primary' style={{ marginLeft:'57%' }} onClick={handleSubmitPassword}>确认</Button>
        </div>
        
    )
    return (
        state === 1 ?
        <div style={{margin:'0 5%'}}>
            <Descriptions
            title="个人信息"
            bordered
            extra={<Button size='middle' onClick={ () => { setState(2) } }>修改信息</Button>}
            >
            <Descriptions.Item label="学号/账号" span={3} style={{ color:'red',fontWeight:'bold' }} >{user.account}</Descriptions.Item>
            <Descriptions.Item label="当前角色" span={3}style={{ fontWeight:'bold' }}>{role.name}</Descriptions.Item>
            <Descriptions.Item label="姓名" span={3}>{user.name}</Descriptions.Item>
            <Descriptions.Item label="邮箱" span={3}>{user.email}</Descriptions.Item>
            <Descriptions.Item label="电话号码" span={3}>{user.telephone}</Descriptions.Item>
            <Descriptions.Item label="学院" span={3}>{user.college}</Descriptions.Item>
            <Descriptions.Item label="年级" span={3}>{user.grade}</Descriptions.Item>
            <Descriptions.Item label="学位" span={3}>{user.degree}</Descriptions.Item>
            <Descriptions.Item label="密码" span={3}>******
            <Popover 
            title='密码修改'
            content={content} 
            trigger='click' 
            // destroyTooltipOnHide={true}
            >
                <Button className='valibutton'>修改密码</Button>
            </Popover>
            </Descriptions.Item>
            </Descriptions>
            
        </div>
        :
        <div>
            <h2>修改个人信息</h2>
            <Form 
            name="modify"
            form={form}
            onFinish={submitInfo}
            {...formItemLayout}
            scrollToFirstError
            size='large'
            autoComplete='off'
            >
                <Form.Item
                name='account'
                label="学号"
                >
                    <Input disabled/>
                </Form.Item>
                <Form.Item
                name="email"
                label="邮箱"
                rules={[
                    {
                    type: 'email',
                    message: '非法邮箱',
                    },
                    {
                    required: true,
                    message: '请输入邮箱!',
                    },
                ]}
                >
                <Input id='haha' />
                </Form.Item>
                <Form.Item
                name='name'
                label="姓名"
                rules={[
                    { required: true, message: '请输入姓名！' }
                ]}>
                    <Input/>
                </Form.Item>

                <Form.Item
                name="telephone"
                label='手机'
                rules={[
                { required: true, message: '请输入手机号码！' }
                ]}
                >
                <Input />
                </Form.Item>
                <Form.Item
                name="degree"
                label='学位'
                rules={[
                { required: true, message: '请输入学位！' }
                ]}
                >
                <Input />
                </Form.Item>
                <Form.Item
                name="college"
                label='学院'
                rules={[
                { required: true, message: '请输入学院！' }
                ]}
                >
                <Input />
                </Form.Item>
                <Form.Item
                name="grade"
                label='年级'
                rules={[
                { required: true, message: '请输入年级！' }
                ]}
                >
                <Input />
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button 
                    type="primary" 
                    style={{ width: '100px', borderRadius: '10px', marginRight:'20px' }} 
                    onClick={ () => { setState(1) } }>
                        返回
                    </Button>
                    <Button type="primary" htmlType="submit" style={{ width: '100px', borderRadius: '10px'}} >
                        提交
                    </Button>
                </Form.Item>
            </Form>
        </div>
        
    )
}

export default Info;