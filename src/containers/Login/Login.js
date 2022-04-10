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
  const [loading, setLoading] = useState(false);     //是否点击登录，用于禁用按钮
  message.config({
    maxCount: 1
  })

  const onFinish = (values) => {
    setLoading(true);
    axios.post(`${url}/login`, {
      account: values.account,
      password: values.password
    }).then(data => {
      if (data.data.code === '200') {
        sessionStorage.setItem(`token`, data.data.data.token)
        setLoading(false);
        //向redux的store中传递用户名和用户类型
        handleUserInfo(values.account, data.data.data.role);
        // store.dispatch(ChangeUserInfo);
        // sessionStorage.setItem('status', 'true');
        // sessionStorage.setItem('role', `${data.data.data.role}`)
        history.push('/home/homepage');
      }
      else {
        message.error(data.data.msg);
        setLoading(false);
      }
    }).catch(err => {
      if(err.response){
        message.error(err.response.data.msg);
      }
      else{
        message.error('登录失败，服务器错误')
      }
      setLoading(false);
      // message.destroy();
    })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const handleUserInfo = (account, role) => {
    const action = {
      type: 'change_userInfo',
      data: {
        account: account,
        status: true,
        typeofUser: role
      }
    }
    store.dispatch(action);
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
        wrapperCol={wra}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"

      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>账号登录</h2>
        <Form.Item
          name="account"
          rules={[
            { required: true, message: '请输入账号！' }
          ]}
        >
          <Input
            placeholder="学号/工号"
            id='username'
          />
        </Form.Item>

        <Form.Item
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

        <Form.Item >
          <p>忘记密码（先别忘）</p>
        </Form.Item>

        <Form.Item >
          <Button type="primary"
            htmlType="submit"
            style={{ borderRadius: '10px', height: '40px', width: '200px' }}
            icon={loading === true ? loadingSignal : ''}
            disabled={loading}
          >
            {loading ? '登录中' : '登录'}
          </Button>
          <div style={{ textAlign: 'center' }}>
            <Button type="link"
              onClick={() => { history.push('/register') }}
            >去注册
            </Button>or
            <Button type="link"
              onClick={() => { history.push('/home/homepage') }}
            >回首页
            </Button>
          </div>

        </Form.Item>
      </Form>
    </div>
  );
}

export default Login;