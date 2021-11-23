// eslint-disable-next-line
import './Login.css';
import { Form, Button, Input, message, } from 'antd';
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import url from '../../server/api/url';
import {
  LoadingOutlined,
} from '@ant-design/icons';
import store from '../../redux/store';

function Login() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  message.config({
    maxCount: 1
  })

  const onFinish = (values) => {
    setLoading(true);
    axios.post(`${url}/login`,{
      email:values.email,
      password:values.password
    }).then( data => {
      console.log(data)
      if(data.data.status==='BS2001'){
        localStorage.setItem(`token`,data.data.data.token)
        setLoading(false);
        //向redux的store中传递用户名和用户类型
        handleUserInfo(values.email, data.data.data.role);
        // store.dispatch(ChangeUserInfo);
        history.push('/home/homepage');
      }
      else {
        if (data.data.msg === 'record not found') {
          message.error('登录失败,用户未注册');
        }
        setLoading(false);
      }
    }).catch(err => {
      console.log(err)
      setLoading(false);
      // message.destroy();
      message.error('登录失败，网络错误！');
    })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const handleUserInfo = (id, role) => {
    const action = {
      type: 'change_userInfo',
      data: {
        email: id,
        status: true,
        typeofUser: role
      }
    }
    store.dispatch(action);
    console.log('redux')
  }


  const wra = {
    offset: 4, span: 16
  }

  const loadingSignal = (<LoadingOutlined />)

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
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>账号登录</h2>
        <Form.Item wrapperCol={wra}
          name="email"
          rules={[
            { required: true, message: '请输入账号！' }
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
            { required: true, message: '请输入密码！' }
          ]}
        >
          <Input.Password
            placeholder="密码"
            id='password'
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 1, span: 11 }}>
          <p>忘记密码</p>
        </Form.Item>

        <Form.Item wrapperCol={wra}>
          <Button type="primary"
            htmlType="submit"
            style={{ borderRadius: '10px', height: '40px', width: '200px' }}
            icon={loading === true ? loadingSignal : ''}
            disabled={loading}
          >
            {loading ? '登录中' : '登录'}
          </Button>
          <Button type="link"

            onClick={() => { history.push('/register') }}
          >去注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Login;