import './ReleaseCompetition.css';
import React, { useState } from "react";
import 'moment/locale/zh-cn';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import {DatePicker, Form, Button, Input as BInput, message} from 'antd';
const ReleaseCompetition=()=>{
    const [firstTime,setFirstTime] = useState(null);
    const [secondTime,setSecondTime] = useState(null);
    const { RangePicker } = DatePicker;

    const onSubmit = ( value ) => {
        if(firstTime>=secondTime){
            message.error('比赛时间早于报名截止时间，请检查时间设定！')
        }
    }
    const onHandleChange = ( date ) => {
        try{
            setFirstTime(date[1]._d);
            console.log(firstTime);
        }
        catch(e){
            console.log(e);
        }
    }
    const onHandleChange2 = ( date ) => {
        try{
            setSecondTime(date[0]._d);
            console.log(secondTime);
        }
        catch(e){
            console.log(e);
        }
    }
    const formItemLayout = {
        labelCol: {
          xs: { span: 16 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 10 },
        },
      };

    return (
        <div className='ni'>
            <Form
            onFinish={onSubmit}
            {...formItemLayout}
            >
                <Form.Item
                name='title'
                label='比赛标题'
                rules={[
                    { required:true,message:'请输入比赛标题!' }
                ]}>
                    <BInput/>
                </Form.Item>

                <Form.Item
                name='description'
                label='比赛简介'
                rules={[
                    { required:true,message:'请输入比赛简介!' }
                ]}
                >
                    <BInput/>
                </Form.Item>

                <Form.Item
                name='entry_requirement'
                label='参赛要求'
                rules={[
                    { required:true,message:'请输入参赛要求!' }
                ]}
                >
                    <BInput/>

                </Form.Item>
                <Form.Item
                name='work_requirement'
                label='作品要求'
                rules={[
                    {required:true,message:'请输入比赛提交的作品要求!'}
                ]}
                >
                    <BInput/>
                </Form.Item>

                <Form.Item
                className='date'
                name='signup_deadline'
                label='报名起止时间'
                rules={[
                    {required:true,message:'请选择报名起止时间!'}
                ]}
                >
                   
                        <RangePicker showTime={{ format: 'HH:mm' }} locale={locale} onChange={onHandleChange} format="YYYY-MM-DD HH:mm"/>                   
                </Form.Item>

                <Form.Item
                name='submit_deadline'
                label='比赛起止时间'
                rules={[
                    {required:true,message:'请输入比赛起止时间!'}
                ]}
                >
                    <RangePicker showTime={{ format: 'HH:mm' }}  locale={locale} onChange={onHandleChange2} format="YYYY-MM-DD HH:mm"/>
                </Form.Item>

                <Form.Item
                name='reward'
                label='比赛奖励'
                >
                    <BInput/>
                </Form.Item>

                <Form.Item
                colon={false}
                label=' '>
                    <Button type="primary" htmlType="submit" style={{borderRadius:'10px',height:'40px',width:'200px'}}>
                        发布
                    </Button>
                </Form.Item>
            </Form>
        </div>
        
    )
}

export default ReleaseCompetition;