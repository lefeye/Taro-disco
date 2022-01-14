import './ReleaseCompetition.css';
import React, { useState } from "react";
import 'moment/locale/zh-cn';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import { DatePicker, Form, Button, Input as BInput, message, Select, InputNumber } from 'antd';
import new_axios from '../../../server/api/axios';
import '../../../server/api/dateChange'
import url from '../../../server/api/url';
import { useHistory } from 'react-router';
import '../../../server/api/dateChange.js'

let min = 0;
let max = 0;
const ReleaseCompetition = () => {
    const [firstTime, setFirstTime] = useState(null);
    const [secondTime, setSecondTime] = useState(null);
    const [isteam,setIsTeam] = useState(false);
    // const [min,setMin] = useState(0);
    // const [ max,setMax] = useState(0);
    const history = useHistory();
    const { Option } = Select;
    const { RangePicker } = DatePicker;

    const onSubmit = (value) => {
        if (firstTime > secondTime) {
            message.error('比赛开始时间早于报名截止时间，请检查时间设定！')
        }
        else {
            //催的太急，axios没有配置拦截器，后续的同学可以配置，不然使用axios请求数据都得添加一个头部，比较麻烦
            new_axios({
                method: "POST",
                url: `${url}/api/v1/setting/contest`,
                data: {
                    title: value.title,
                    brief: value.brief,
                    sponsor:value.sponsor,
                    award: value.reward,
                    condition: value.entry_requirement,
                    attribute: value.attribute,
                    begin_signup:value.signup_deadline[0]._d.Format("yyyy-MM-dd hh:mm:ss"),
                    end_signup:firstTime,
                    begin_submit: secondTime,
                    end_submit: value.submit_deadline[1]._d.Format("yyyy-MM-dd hh:mm:ss"),
                    min_num:value.attribute === 'team'? min : null,
                    max_num:value.attribute === 'team'? max : null,
                }
            })
                .then(value => {
                    console.log(value);
                    if (value.data.code === '200') {
                        message.info('比赛发布成功！');
                        history.push('/home/personalcenter/released')
                    }
                    else message.error('发布失败，'+value.data.msg);
                }).catch(e => {
                    if(e.response){
                        message.error(e.response.data.msg);
                    }
                    console.log(e);
                })
        }

    }

    //选择参赛形式
    const attributeChange = value => {
        if( value === 'team' ){
            setIsTeam(true)
        }
        else {
            setIsTeam(false);
        }
    }

    const onHandleChange = (date) => {
        try {
            setFirstTime(date[1]._d.Format("yyyy-MM-dd hh:mm:ss"));
        }
        catch (e) {
            console.log(e);
        }
    }
    const onHandleChange2 = (date) => {
        try {
            setSecondTime(date[0]._d.Format("yyyy-MM-dd hh:mm:ss"));
        }
        catch (e) {
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
    const changeMin = value => {
        min = value;
        console.log(min);
    }
    const changeMax = value => {
        max = value;
        console.log(max);
    }
    const numbers = (
        <div>
            <Form.Item
            label='人数'
            name='min'>
                <InputNumber min={1} max={10} onChange={ changeMin }></InputNumber>~
                <Form.Item
                name='max'
                noStyle>
                    <InputNumber min={1} max={10} onChange={ changeMax }></InputNumber>人（最多10人）
                </Form.Item>
            </Form.Item>
            
        </div>
        
    )
    return (
        <div className='ni'>
            <Form
                onFinish={onSubmit}
                autoComplete='off'
                {...formItemLayout}
            >
                <Form.Item
                
                    name='title'
                    label='比赛标题'
                    rules={[
                        { required: true, message: '请输入比赛标题!' }
                    ]}>
                    <BInput />
                </Form.Item>
                
                <Form.Item
                    name='sponsor'
                    label='主办方'
                    rules={[
                        { required: true, message: '请输入主办方!' }
                    ]}
                >
                    <BInput />
                </Form.Item>

                <Form.Item
                    name='brief'
                    label='简介'
                    rules={[
                        { required: true, message: '请输入简介!' }
                    ]}
                >
                    <BInput.TextArea />
                </Form.Item>

                <Form.Item
                    name='entry_requirement'
                    label='参赛条件'
                    rules={[
                        { required: true, message: '请输入参赛条件!' }
                    ]}
                >
                    <BInput.TextArea placeholder='如限本科生'/>

                </Form.Item>
                {/* <Form.Item
                    name='work_requirement'
                    label='作品要求'
                    rules={[
                        { required: true, message: '请输入比赛提交的作品要求!' }
                    ]}
                >
                    <BInput.TextArea />
                </Form.Item> */}
                
                <Form.Item
                label='参赛形式'
                name='attribute'
                rules={[
                    { required: true, message: '请输入参赛形式!' }
                ]}
                >
                    <Select onChange={ attributeChange } placeholder='单人或组队' >
                        <Option value="single">单人</Option>
                        <Option value="team">组队</Option>
                    </Select>
                    
                </Form.Item>
                {
                    isteam ? numbers : <></>
                }
                <Form.Item
                    name='reward'
                    label='比赛奖励'
                    rules={[
                        { required: true, message: '请输入比赛奖励!' }
                    ]}
                >
                    <BInput.TextArea />
                </Form.Item>

                <Form.Item
                    className='date'
                    name='signup_deadline'
                    label='报名起止时间'
                    rules={[
                        { required: true, message: '请选择报名起止时间!' }
                    ]}
                >

                    <RangePicker showTime={{ format: 'HH:mm' }} locale={locale} onChange={onHandleChange} format="YYYY-MM-DD HH:mm" />
                </Form.Item>

                <Form.Item
                    name='submit_deadline'
                    label='比赛起止时间'
                    rules={[
                        { required: true, message: '请输入比赛起止时间!' }
                    ]}
                >
                    <RangePicker showTime={{ format: 'HH:mm' }} locale={locale} onChange={onHandleChange2} format="YYYY-MM-DD HH:mm" />
                </Form.Item>

                <Form.Item
                    colon={false}
                    label=' '>
                    <Button type="primary" htmlType="submit" style={{ borderRadius: '10px', height: '40px', width: '200px' }}>
                        发布
                    </Button>
                </Form.Item>
            </Form>
        </div>

    )
}

export default ReleaseCompetition;