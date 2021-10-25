// eslint-disable-next-line
import './Login.css';
import {Form,Button,Checkbox,Input} from 'antd';
//import React, { useState,useEffect } from 'react';
function Login() {
  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const wra={
     offset: 4, span: 16 
  }
  return (
    <div>
      <Form className="form"
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        
      >
        <h2 style={{textAlign:'center',marginBottom:'20px'}}>账号登录</h2>
        <Form.Item wrapperCol={wra}
          name="username"
          rules={[
            {required:true,message:'请输入账号！'}
          ]}
          // rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input placeholder="邮箱"/>
        </Form.Item>

        <Form.Item wrapperCol={wra}
          name="password"
          rules={[
            {required:true,message:'请输入密码！'}
          ]}
          //rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="密码"/>
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" wrapperCol={{offset:1,span:10}}>
          <Checkbox>记住密码</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={wra}>
          <Button type="primary" htmlType="submit" style={{borderRadius:'10px',height:'40px'}}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
    
  );
}

export default Login;