// eslint-disable-next-line
import './Login.css';
import {Form,Button,Checkbox,Input} from 'antd';
import React, { useState,useEffect } from 'react';
import axios from 'axios';
function Login() {
  const [state,setState]=useState(localStorage.getItem('state')=='true'?true:false)

  useEffect(()=>{
    console.log(typeof state)
  })
  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const wra={
     offset: 4, span: 16 
  }
  const onChangeCheck=(e)=>{
    let value=e.target.checked
    setState(value);
    localStorage.setItem('state',value);
    if(value===false){
      localStorage.setItem('username','');
      localStorage.setItem('password','');
    }
  }

  const test=()=>{
    axios.get("http://localhost:8080/test/testtoken",{
      headers:{
        'token':localStorage.getItem('token')
      }
    }).then(data=>{
      console.log(data);
    }).catch(err=>{
      console.log(err)
    })
  }

  const login=()=>{
    if(state===true){
      localStorage.setItem('username',document.getElementById('username').value);
      localStorage.setItem('password',document.getElementById('password').value);
    }
    else{
      localStorage.removeItem('username');
      localStorage.removeItem('password');
    }
    axios.post("http://localhost:8080/login").then(data=>{
      console.log(data);
      localStorage.setItem('token',data.data.data.Token)
    }).catch(err=>{
      console.log(err)
    })
  }
  return (
    <div>
      <Form className="form"
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ password:localStorage.getItem('password'), username:localStorage.getItem('username')}}
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
          <Input 
          placeholder="邮箱" 
          //defaultValue={localStorage.getItem('username')}
          id='username'
          />
        </Form.Item>

        <Form.Item wrapperCol={wra}
          name="password"
          rules={[
            {required:true,message:'请输入密码！'}
          ]}
          //rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password 
          placeholder="密码" 
          id='password'
          //defaultValue={localStorage.getItem('password')}
          />
        </Form.Item>

        <Form.Item name="remember"  wrapperCol={{offset:3,span:10}}>
          <Checkbox defaultChecked={state} onChange={onChangeCheck}>记住密码</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={wra}>
          <Button type="primary" htmlType="submit" onClick={login} style={{borderRadius:'10px',height:'40px'}}>
            登录
          </Button>
        </Form.Item>
      </Form>
      <Button onClick={test}>test</Button>
    </div>
    
  );
}

export default Login;