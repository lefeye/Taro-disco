// eslint-disable-next-line
import './Register.css'
import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import url from '../../server/api/url';
import { useHistory } from 'react-router-dom';
import store from '../../redux/store';
import {
  Form,
  Button,
  Input,
  Radio,
  Row,
  Col,
  message
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

  const history = useHistory()
  const [form] = Form.useForm();
  const [value, setValue] = useState(1);

  const handleUserInfo = (email, role) => {
    const action = {
      type: 'change_userInfo',
      data: {
        email: email,
        status: true,
        typeofUser: role
      }
    }
    store.dispatch(action);
    console.log('redux')
  }

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    axios.post(`${url}/register`, {
      stu_no: values.stu_no,
      stu_email: values.email,
      stu_college: values.stu_college,
      stu_name: values.name,
      stu_password: values.password,
      stu_grade: values.stu_grade,
    }).then(data => {
      if (data.data.status === 'BS2002') {
        message.info('注册成功，为您自动登录！');
        axios.post(`${url}/login`, {
          email: values.email,
          password: values.password
        }).then(data => {
          console.log(data)
          if (data.data.status === 'BS2001') {
            sessionStorage.setItem(`token`, data.data.data.token)
            //向redux的store中传递用户名和用户类型
            handleUserInfo(values.email, data.data.data.role);
            // store.dispatch(ChangeUserInfo);
            // sessionStorage.setItem('status', 'true');
            // sessionStorage.setItem('role', `${data.data.data.role}`)
            history.push('/home/homepage')
          }
          else {
            if (data.data.msg === 'record not found') {
              message.error('登录失败,用户未注册');
            }
          }
        }).catch(err => {
          console.log(err)
          message.error('登录失败，网络错误！');
        })
      }
      console.log(data)
    }).catch(err => {
      console.log(err)
    })
  };


  const company = (<><Form.Item
    name="stu_college"
    label="学院"
  >
    <Input />
  </Form.Item>

    <Form.Item
      name="stu_grade"
      label='年级'
    >
      <Input placeholder='18级/19级/20级/21级' />
    </Form.Item>

    <Form.Item
      name="name"
      rules={[
        { required: true, message: '请输入姓名！' }
      ]}
      label='姓名'
    >
      <Input placeholder='请输入真实名字' />
    </Form.Item></>)

  const onChange = (e) => {
    setValue(e.target.value)
  }
  return (
    <div className="register_bg">

      <Form className="form_Reg"
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
        autoComplete="off"
      >
        {/* <Form.Item
          name="radio"
          label="用户类型"
          rules={[
            { required: true }
          ]}
        >
          <Radio.Group onChange={onChange} value={value}>
            <Radio value={1}>学生</Radio>
            <Radio value={2}>企业</Radio>
          </Radio.Group>
        </Form.Item> */}

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
          name='yanzhengma'
          label="验证码"
          rules={[
            { required: true, message: '请输入验证码！' }
          ]}>
          <Row gutter={8} >
            <Col span={15}>
              <Form.Item
                noStyle
                name="confirmcode"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Button style={{ width: '70px' }}>获取</Button>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          name="stu_no"
          label={value === 1 ? '学号' : '公司名称'}
          rules={[
            {
              required: true,
              message: `请输入${value === 1 ? '学号' : '公司名称'}`
            }
          ]}>
          <Input />
        </Form.Item>

        {value === 1 ? company : ''}


        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              pattern: /^(\w){6,20}$/,
              required: true,
              message: '请输入合法的密码!',
            },
          ]}
          hasFeedback
        >
          <Input.Password placeholder='6-20个字母、数字或下划线' />
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
          <Input.Password placeholder='6-20个字母、数字或下划线' />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" style={{ width: '200px', borderRadius: '5px' }} >
            注册
          </Button>
        </Form.Item>
      </Form>

    </div>

  );
};

export default RegistrationForm;