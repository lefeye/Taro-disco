// eslint-disable-next-line
import './Register.css'
import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import url from '../../server/api/url';
import {
  Form,
  Button,
  Input,
  Radio,
  Row,
  Col
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
  const [value, setValue] = useState(1);
  
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    axios.post(`${url}/register`,{
      stu_no:values.stu_no,
      email:values.email,
      stu_college:values.stu_college,
      name:values.name,
      password:values.password,
      stu_grade:values.stu_grade,
    }).then( data => {
        console.log(data)
    }).catch( err => {
      console.log(err)
    })
  };


  const company = ( <><Form.Item
    name="stu_college"
    label="学院"
    >
      <Input/>
    </Form.Item>
    
    <Form.Item
    name="stu_grade"
    label='年级'
    >
      <Input/>
    </Form.Item>

    <Form.Item
    name="name"
    rules={[
        {required:true,message:'请输入姓名！'}
    ]}
    label='姓名'
    >
      <Input/>
    </Form.Item></>)

  const onChange=(e)=>{
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
      >
        <Form.Item
        name="radio"
        label="用户类型"
        wrapperCol={{pull:2}}
        rules={[
          {required:true}
        ]}
        >
        <Radio.Group onChange={onChange} defaultValue={value}>
          <Radio value={1}>学生</Radio>
          <Radio value={2}>企业</Radio>
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
          {required:true,message:'请输入验证码！'}
        ]}>
          <Row gutter={8} >
            <Col span={15}>
            <Form.Item 
              noStyle
              name="confirmcode" 
            >
              <Input/> 
            </Form.Item>
            </Col>
            <Col span={8}>
              <Button style={{width:'70px'}}>获取</Button>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
        name="stu_no"
        label={value===1?'学号':'公司名称'}
        rules={[
          {required:true,
          message:`请输入${value===1?'学号':'公司名称'}`}
        ]}>
            <Input/>
        </Form.Item>
        
        {value===1?company:''}
        

        <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            pattern:/^(\w){6,20}$/,
            required: true,
            message: '请输入合法的密码!',
          },
        ]}
        hasFeedback
        >
          <Input.Password placeholder='6-20个字母、数字或下划线'/>
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
          <Input.Password placeholder='6-20个字母、数字或下划线'/>
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit"style={{width:'200px',borderRadius:'5px'}} >
            注册
          </Button>
        </Form.Item>
      </Form>
      
  </div>
    
  );
};

export default RegistrationForm;