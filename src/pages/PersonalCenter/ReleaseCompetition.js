import './ReleaseCompetition.css';
import React from "react";
import {DatePicker, Form, Button,Input as BInput} from 'antd';
const ReleaseCompetition=()=>{
    const onSubmit=(value)=>{
        console.log(value.submit_deadline._d instanceof Date);
    }

    const formItemLayout = {
        labelCol: {
          xs: { span: 16 },
          sm: { span: 4 },
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
                    {required:true,message:'请输入比赛标题!'}
                ]}>
                    <BInput/>
                </Form.Item>

                <Form.Item
                name='description'
                label='比赛简介'
                rules={[
                    {required:true,message:'请输入比赛简介!'}
                ]}
                >
                    <BInput/>
                </Form.Item>

                <Form.Item
                name='entry_requirement'
                label='参赛要求'
                rules={[
                    {required:true,message:'请输入参赛要求!'}
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
                name='signup_deadline'
                label='报名截止时间'
                rules={[
                    {required:true,message:'请选择报名截止时间!'}
                ]}
                >
                    <DatePicker/>
                </Form.Item>

                <Form.Item
                name='submit_deadline'
                label='提交作品截止时间'
                rules={[
                    {required:true,message:'请选择作品提交截止时间!'}
                ]}
                >
                    <DatePicker />
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
                    <Button type="primary" htmlType="submit">
                        发布
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default ReleaseCompetition;