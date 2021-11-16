// eslint-disable-next-line
import './Register.css'
import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Radio
} from 'antd';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const RegistrationForm = () => {
  const [form] = Form.useForm();
  const [value,setValue]=useState(1);
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  const onChangeEmail=e=>{
    
    console.log(e.target.value)
  }

  const onSendEmail=()=>{
    let email=document.getElementById('haha').value;
    if(email.indexOf('@'&&email.indexOf('.com'))){
      axios.post('http://127.0.0.1:4000/register',{
        em:email
      }).then(res=>{
        console.log(res);
      }).catch(e=>{
        console.log(e);
      })
    }
    
  }

  const onChange=(e)=>{
    setValue(e.target.value)
    console.log(e.target.value);
  }
  return (
    <div className="register_bg">

      <Form className="form_Reg"
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      scrollToFirstError
      >
        <Form.Item
        name="radio"
        label="用户类型"
        wrapperCol={{pull:1}}
        rules={[
          {required:true}
        ]}
        >
        <Radio.Group onChange={onChange} value={value}>
          <Radio value={1}>学生</Radio>
          <Radio value={2}>管理人员</Radio>
        </Radio.Group>
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
          <Input id='haha' onChange={onChangeEmail}/>
          <Button 
            className="emailButton"
            onClick={onSendEmail}
            >获取
            </Button>
        </Form.Item>

        <Form.Item 
          name="confirmcode"
          label="验证码"
          wrapperCol={{offset:0,span:2}}
          rules={[
            {required:true,message:'请输入验证码！'}
          ]}
          
        >
          <Input style={{width:'110px'}}/> 
        </Form.Item>
        <Form.Item
        name="studentNo"
        label={value===1?'学号':'公司名称'}
        rules={[
          {required:true,
          message:"请输入学号！"}
        ]}>
          <Input/>
        </Form.Item>

        <Form.Item
        name="college"
        label={value===1?'学院':'公司简介'}
        >
          <Input/>
        </Form.Item>

        <Form.Item
        name="name"
        rules={[
            {required:true}
        ]}
        label={value===1?'姓名':'用户名称'}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: '请输入密码!',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="确认密码"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: '请确认密码!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('密码不一致，请检查是否出错!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" >
            注册
          </Button>
        </Form.Item>
      </Form>
      
  </div>
    
  );
};

export default RegistrationForm;