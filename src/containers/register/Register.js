// eslint-disable-next-line
import './Register.css'
// import axios from 'axios';
import axios from '../../server/api/axios'
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
  message,
  Select
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
  const { Option } = Select;

  const getCaptcha = () => {
    const value=form.getFieldsValue(true);
    axios.post(`${url}/send-verification-code`,{
      email:value.email
    }).then( data => {
      if(data.data.code === '200'){
        message.info('验证码已发送，请在邮箱查收')
      }
      else{
        message.error('验证码发送失败，网络异常')
      }
    }).catch( e =>{
      console.log(e)
    })
  }

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

  const onFinish = (values) => {
    axios.post(`${url}/register`, {
      account: values.stu_no,
      email: values.email,
      college: values.stu_college,
      name: values.name,
      password: values.password,
      grade: values.stu_grade,
      telephone:values.telephone,
      degree:values.degree,
      identity:value===1?'student':'teacher',
      code:values.confirmcode
    }).then(data => {
      if (data.data.code === '200') {
        message.info('注册成功，为您自动登录！');
        axios.post(`${url}/login`, {
          account: values.stu_no,
          password: values.password
        }).then(data => {
          if (data.data.code === '200') {
            sessionStorage.setItem(`token`, data.data.data.token)
            //向redux的store中传递用户名和用户类型
            handleUserInfo(values.stu_no, data.data.data.role);
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
    }).catch(err => {
      console.log(err)
    })
  };


  const company = (
  <>

    <Form.Item
    name="degree"
    label="学位"
    >
      <Select>
        <Option value='本科生'>本科生</Option>
        <Option value='研究生'>研究生</Option>
      </Select>
    </Form.Item>

    <Form.Item
      name="stu_grade"
      label='年级'
    >
      <Input placeholder='18级/19级/20级/21级' />
    </Form.Item>
  </>)

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
        autoComplete='off'
      >
        <Form.Item
          name="radio"
          label="用户类型"
          rules={[
            { required: true }
          ]}
        >
          <Radio.Group onChange={onChange} value={value}>
            <Radio value={1}>学生</Radio>
            <Radio value={2}>教师</Radio>
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
              <Button style={{ width: '70px' }} onClick={getCaptcha} >获取</Button>
            </Col>
          </Row>
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
          name="stu_no"
          label={value === 1 ? '学号' : '工号'}
          rules={[
            {
              required: true,
              message: `请输入${value === 1 ? '学号' : '工号'}`
            }
          ]}>
          <Input placeholder='一旦注册不可修改'/>
        </Form.Item>

        <Form.Item
        name="stu_college"
        label="学院"
        >
          <Select>
            <Option value='计算机科学与工程学院'>计算机科学与工程学院</Option>
            <Option value='软件学院'>软件学院</Option>
          </Select>
        </Form.Item>
        {value === 1 ? company : ''}

        <Form.Item
        name="name"
        rules={[
          { required: true, message: '请输入姓名！' }
        ]}
        label='姓名'
        >
          <Input placeholder='请输入真实名字' />
        </Form.Item>

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
          <div>已有账号，去<Button type='link' onClick={ ()=>{history.push('/login')} }>登录</Button> </div>
        </Form.Item>
      </Form>

    </div>

  );
};

export default RegistrationForm;