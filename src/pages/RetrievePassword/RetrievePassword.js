
import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Steps, message, Space, Result } from 'antd';
import new_axios from '../../server/api/axios';
import url from '../../server/api/url';
import { UserOutlined  } from '@ant-design/icons';
import './RetrievePassword.css'
import { useHistory } from 'react-router-dom';
let account = '',keepaccount = '';
let email = '';
let newPassword = '';
let captcha = '';
let se = 5;
const Retrieve = () => {
  const { Step } = Steps;
  const [currentState,setCurrentState] = useState(0);
  const [mes,setMess] = useState('');
  const [mess2,setmess2] = useState('');
  const [second,setSecond] = useState(se);
  const history = useHistory();
  const timer = useRef(null)
  //获取用户输入的账号
  const getAccount = e => {
    account = e.target.value;
  }

  const myinter = () => {
    timer.current = setInterval( () => {
      console.log(second)
      setSecond(--se);
      console.log(se)
    },1000)
  }
  useEffect( () => {
    return () => clearInterval(timer.current);
  },[] )
   //查询用户是否存在
  const sendAccount = () => {
    if(account){
      new_axios({
        method:'POST',
        url:url+'/check-account-exist',
        data:{
          account:account
        }
      }).then( res => {
        if(res.data.code === 'LPS4002'){
          message.error(res.data.msg+'请确认输入无误');
        }
        if(res.data.code === '200'){
          message.info('查询成功，为您跳转到下一步');
          keepaccount = account
          setCurrentState(1);
        }
      } ).catch( e => {
        console.log(e);
      } )
    }
    else{
      message.warn('请输入账号')
    }
  }

  //获取用户输入的邮箱
  const getEmail = e => {
    email = e.target.value;
  }

  //给用户发送验证码
  const sendEmail = () => {
    if(email){
      new_axios({
        method:'POST',
        url:url+'/send-password-code',
        data:{
          account:keepaccount,
          email:email
        }
      }).then( res => {
        if(res.data.code === '200'){
          message.info(res.data.msg)
          setCurrentState(2)
        }
        if(res.data.code==='LPS4003'){
          setMess(res.data.msg)
          message.error(res.data.msg)
        }
      } ).catch( e => {
        console.log(e)
      } )
    }
    else{
      message.warn('请输入邮箱')
    }
  }

  //获取密码
  const getPassword = e => {
    newPassword = e.target.value;
  }

  //读取验证码
  const getCaptcha = e => {
    captcha = e.target.value;
  }

  //提交密码和验证码
  const sendPC = () => {
    if(newPassword&&captcha){
      new_axios({
        method:'POST',
        url:url+'/change-password',
        data:{
          account:keepaccount,
          password:newPassword,
          code:captcha
        }
      }).then( res => {
        if(res.data.code ==='LPS4001'){
          setmess2(res.data.msg)
          message.error(res.data.msg);
        }
        else if(res.data.code === '200'){
          message.info(res.data.msg);
          setCurrentState(3);
          setTimeout( () => {
            history.push('/login');
          },5000)
          myinter()
        }
        else{
          message.error('服务器错误');
        }
      } ).catch( e =>{
        console.log(e)
      } )
    }
    else{
      message.warn('请检查邮箱和验证码是否输入');
    }
  }

  const inputEmail = (
    <div className='children'>
      <Input placeholder='输入绑定此账户的邮箱' key={2} style={{marginBottom:'20px'}}onChange={getEmail}></Input>
      <Button type='primary' onClick={sendEmail}>发送验证码</Button>
      <p style={{color:'red'}}>{mes}</p>
    </div>
  )

  const setPassword = (
    <div className='children'>
      <Space direction='vertical'>
        <Input.Password key={3} placeholder='设置密码' onChange={getPassword}></Input.Password>
        <Input key={4} placeholder='验证码' onChange={getCaptcha} style={{width:'200px'}}/>
        <span style={{color:'red'}}>{mess2}</span>
        <Button type='primary' onClick={sendPC}>提交</Button>
      </Space>
      
    </div>
  )

  const success = (
    <Result 
    status='success'
    title='找回并修改密码成功'
    subTitle={'即将在'+second+'秒后跳转至登录页面'}
    />
  )

  return (
    <div className='rebody'>
      <Steps current={currentState} style={{ marginBottom:'50px' }}>
        <Step title="填写账号"/>
        <Step title="身份验证"/>
        <Step title="设置新密码"/>
        <Step title="完成"/>
      </Steps>
      <Space direction='vertical'>
        {
          currentState === 0 ?
          <div className='children'>
              <Input  key={1} prefix={<UserOutlined/>} placeholder='输入账号' style={{marginBottom: '20px'}} onChange={getAccount}></Input>
              <Button type='primary' onClick={sendAccount}>确定</Button>
          </div> :
          currentState === 1?
          inputEmail :
          currentState === 2 ?
          setPassword : success
        }
      </Space>
      
    </div>
  )
}

export default Retrieve;