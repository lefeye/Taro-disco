import {
    Card, Col, Row,
    Button, message,
    Spin, Empty, Drawer,
    Form, Input,
    DatePicker
} from "antd";
import 'moment/locale/zh-cn';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import { LoadingOutlined } from '@ant-design/icons';
import axios from "axios";
import React, { useEffect, useState } from "react";
import './Released.css'
import url from "../../../server/api/url";
import moment from "moment";
import { useHistory } from "react-router-dom";
const Released = () => {
    const [load, setLoad] = useState(true);                            //加载中
    const [element, setElement] = useState([]);                        //展开成react对象后的数组
    const [visible, setVisible] = useState(false);                     //抽屉可视化
    const [form] = Form.useForm();                                     //表单对象
    const [currentId, setCurrentId] = useState(10000);                 //当前选中的比赛ID
    const history = useHistory();                                      //路由操作 
    message.config({
        maxCount: 1
    })

    useEffect(() => {
        //获取比赛数据
        axios({
            method: "GET",
            url: `${url}/api/v1/setting/competition/get-list`,
            headers: {
                'token': localStorage.getItem('token')
            }
        }).then(data => {
            if (data.data.status === 200) {
                const data1 = data.data.data;
                const data3 = [];
                for (const item of data1) {
                    data3.unshift(
                        <Col span={8} key={item.id}>
                            <Card
                                title={item.title}
                                className='card'
                                extra={<Button type='link' onClick={() => { viS(item) }}>详情</Button>}
                            >

                                <p>简介：{item.description}</p>
                                <p>比赛要求：{item.entry_requirement}</p>
                                <p>作品要求：{item.work_requirement}</p>
                                <p>奖励：{item.reward}</p>
                                <p>报名截止时间：{item.signup_deadline}</p>
                                <p>比赛截止时间：{item.submit_deadline}</p>
                                <Button onClick={() => { searchSignupInfo(item) }}>查看报名情况</Button>
                            </Card>
                        </Col>
                    )
                }
                setLoad(false);//把加载中图标取消掉
                setElement(data3);
            }
            else if (data.data.status === -1) {
                message.error('登录授权过期，请重新登录！');
                history.push('/login');
            }
        }).catch(e => {
            console.log(e)
        })
    }, [])

    //点击按钮展开比赛信息
    const viS = item => {
        setVisible(true)
        console.log(item);
        setCurrentId(item.id);
        form.setFieldsValue({
            title: item.title,
            description: item.description,
            entry_requirement: item.entry_requirement,
            work_requirement: item.work_requirement,
            reward: item.reward,
            signup_deadline: moment(item.signup_deadline),
            submit_deadline: moment(item.submit_deadline)
        })
    }

    //跳转到参赛人员列表
    const searchSignupInfo = item => {
        localStorage.setItem('competition_id', `${item.id}`);
        history.push('/home/searchsignupinfo');
    }

    //修改比赛
    const handleSubmit = () => {
        const values = form.getFieldsValue(true);
        let firstTime = values.signup_deadline._d.Format("yyyy-MM-dd hh:mm:ss");
        let secondTime = values.submit_deadline._d.Format("yyyy-MM-dd hh:mm:ss");
        if (firstTime > secondTime) {
            message.error('比赛截止时间早于报名截止时间，请检查时间设定！');
        }
        else {
            let urll = `${url}/api/v1/setting/competition/${currentId}`;
            console.log(currentId);
            console.log(urll);
            axios({
                method: "PUT",
                url: `${url}/api/v1/setting/competition/${currentId}`,
                headers: {
                    'token': localStorage.getItem('token')
                },
                data: {
                    title: values.title,
                    description: values.description,
                    reward: values.reward,
                    entry_requirement: values.entry_requirement,
                    work_requirement: values.work_requirement,
                    signup_deadline: firstTime,
                    submit_deadline: secondTime
                },
            }).then(data => {
                if (data.data.status === 'BS2004') {
                    message.info('更新比赛成功！');
                    setVisible(false);
                    window.location.reload();
                }
                else {
                    message.error('更新失败')
                }
            }).catch(e => {
                console.log(e);
                message.error("网络错误");
            })
        }
    }

    const spin = (<LoadingOutlined style={{ fontSize: 24 }} spin />);

    return (
        <div style={{ margin: "2%" }}>
            <Row gutter={[16, 16]}>
                {load === true ?
                    <Spin indicator={spin} tip='loading' style={{ margin: '30px auto' }} />
                    : element.length > 0 ?
                        element
                        : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无数据' />}
            </Row>
            <Drawer
                title="查看/修改比赛数据"
                width={720}
                visible={visible}
                onClose={() => { setVisible(false) }}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                    <Form.Item>
                        <Button type="primary" onClick={handleSubmit}>
                            修改
                        </Button>
                    </Form.Item>

                }

            >
                <Form layout="vertical" hideRequiredMark
                    form={form}
                    onFinish={handleSubmit}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="title"
                                label="比赛标题"
                                rules={[{ required: true, message: '标题不能为空' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="description"
                                label="比赛描述"
                                rules={[
                                    {
                                        required: true,
                                        message: '比赛描述不能为空',
                                    },
                                ]}
                            >
                                <Input.TextArea rows={4} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="entry_requirement"
                                label="比赛要求"
                                rules={[
                                    {
                                        required: true,
                                        message: '比赛要求不能为空',
                                    },
                                ]}
                            >
                                <Input.TextArea rows={3} placeholder='例如：参赛队员不能少于3人或多于5人' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="work_requirement"
                                label="作品要求"
                                rules={[
                                    {
                                        required: true,
                                        message: '作品要求不能为空',
                                    },
                                ]}
                            >
                                <Input.TextArea rows={3} placeholder='例如：以压缩文件提交' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="reward"
                                label="比赛奖励"
                                rules={[
                                    {
                                        required: true,
                                        message: 'please enter url description',
                                    },
                                ]}
                            >
                                <Input.TextArea rows={2} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="signup_deadline"
                                label="报名截止时间"
                                rules={[{ required: true, message: '报名截止时间不能为空' }]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    format="YYYY-MM-DD HH:mm"
                                    showTime={{ format: 'HH:mm' }}
                                    locale={locale}
                                //getPopupContainer={trigger => trigger.parentElement}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="submit_deadline"
                                label="比赛截止时间"
                                rules={[{ required: true, message: '比赛截止时间不能为空' }]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    locale={locale}
                                    // getPopupContainer={trigger => trigger.parentElement}
                                    format="YYYY-MM-DD HH:mm"
                                    showTime={{ format: 'HH:mm' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </div>
    )
}

export default Released;