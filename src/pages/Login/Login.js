// eslint-disable-next-line
import './Login.css';
import {Form,Button,Input, message} from 'antd';
import React from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom'
function Login() {
  const history=useHistory();

  const onFinish = (values) => {
    console.log('Success:', values);
    axios.post("http://localhost:8080/login",{
      email:values.email,
      password:values.password
    }).then(data=>{
      console.log(data)
      localStorage.setItem(`token`,data.data.data.Token)
      history.push('/');
    }).catch(err=>{
      console.log(err)
      message.error('登录失败');
    })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const wra={
     offset: 4, span: 16 
  }

  const test=()=>{
    axios.get("http://localhost:8080/test/testtoken",{
      headers:{
        'token':localStorage.getItem('token')
      }
    }).then(data=>{
      history.push('/')
      console.log(1)
      console.log(data);
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
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        
      >
        <h2 style={{textAlign:'center',marginBottom:'20px'}}>账号登录</h2>
        <Form.Item wrapperCol={wra}
          name="email"
          rules={[
            {required:true,message:'请输入账号！'}
          ]}
        >
          <Input 
          placeholder="邮箱" 
          id='username'
          />
        </Form.Item>

        <Form.Item wrapperCol={wra}
          name="password"
          rules={[
            {required:true,message:'请输入密码！'}
          ]}
        >
          <Input.Password 
          placeholder="密码" 
          id='password'
          />
        </Form.Item>
        
        <Form.Item wrapperCol={{offset:1,span:11}}>
          <a>忘记密码</a>
        </Form.Item>

        <Form.Item wrapperCol={wra}>
          <Button type="primary" htmlType="submit" style={{borderRadius:'10px',height:'40px'}}>
            登录
          </Button>
        </Form.Item>
      </Form>
      <Button onClick={test}>test</Button>
    </div>
  );
}

export default Login;