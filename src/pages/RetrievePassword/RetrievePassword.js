
import React, { useState } from 'react';
import { Button, Input, Steps } from 'antd';
import new_axios from '../../server/api/axios';
import url from '../../server/api/url';
import { UserOutlined  } from '@ant-design/icons';
import './RetrievePassword.css'

const Retrieve = () => {
    const { Step } = Steps;
    const [currentState,setCurrentState] = useState(0);
  return (
    <div className='rebody'>
      <Steps current={currentState} style={{ marginBottom:'50px' }}>
        <Step title="填写账号"/>
        <Step title="身份验证"/>
        <Step title="设置新密码"/>
        <Step title="完成"/>
      </Steps>
      <div className='children'>
            <Input prefix={<UserOutlined/>} placeholder='输入账号' style={{marginBottom: '30px'}}></Input>
            <Button style={{width:'200px'}}>确定</Button>
      </div>
       
      
    </div>
  )
}

export default Retrieve;