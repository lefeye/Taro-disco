// eslint-disable-next-line
import './index.css';
import {Form,Button,Input, message,} from 'antd';
import React, { useState }from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import {
  LoadingOutlined,
} from '@ant-design/icons';
function Login() {
  const history=useHistory();
  const [loading,setLoading]=useState(false);
  message.config({
    maxCount:1
  })

  const onFinish = (values) => {
    setLoading(true);
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
      // message.destroy();
      message.error('登录失败，请检查您的邮箱和密码是否正确！');
    }).finally(()=>{
      setLoading(false);
    })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const wra={
     offset: 4, span: 16 
  }

  const loadingSignal=(<LoadingOutlined/>)

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
          <p>忘记密码</p>
        </Form.Item>

        <Form.Item wrapperCol={wra}>
          <Button type="primary" 
          htmlType="submit" 
          style={{borderRadius:'10px',height:'40px',width:'200px'}} 
          icon={loading===true?loadingSignal:''}
          disabled={loading}
          >
            {loading?'登录中':'登录'}
          </Button>
          <Button type="primary" 
          style={{borderRadius:'10px',height:'40px',width:'200px'}} 
          onClick={()=>{ history.push('/register') }}
            >注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Login;