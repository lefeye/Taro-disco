import React, { useState } from 'react';
import store from '../../redux/store';
import axios from 'axios';
import 'antd/dist/antd.css';
import {
    Form,
    Input,
    Cascader,
    Select,
    Row,
    Col,
    Checkbox,
    Button,
    Space
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

export default function SignUp() {
    // const [userId, setUserId] = useState(store.getState())
    // const [status, setStatus] = useState()
    const userId = store.getState()
    const [form] = Form.useForm();
    const { Option } = Select;
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        console.log('Received stu_id of form: ', values.student_id);
        console.log('userId', userId)
        axios.post("http://127.0.0.1:8080/api/v1/user/competition/sign-up", {
            competition_id: "ght",
            remark: values.teamMember
        }).then(data => {
            console.log(data)
            //   localStorage.setItem(`token`,data.data.data.Token)
            //   history.push('/');
        }).catch(err => {
            console.log(err)
            // message.destroy();
            console.error('提交失败');
        }).finally(() => {
            //   setLoading(false);
        })
    };

    const formItemLayout = {
        labelCol: {
            xs: {
                span: 24,
            },
            sm: {
                span: 8
            },
        },
        wrapperCol: {
            xs: {
                span: 10,
            },
            sm: {
                span: 8,
            },
        },
    };
    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 8,
            },
            sm: {
                span: 12,
                offset: 0,
            },
        },
    };
    const residences = [
        {
            value: 'scut',
            label: '华南理工大学',
            children: [
                {
                    value: 'cs',
                    label: '计算机科学与工程学院',
                    children: [
                        {
                            value: 'computer science',
                            label: '计算机科学与技术',
                        },
                        {
                            value: 'Network engineering',
                            label: '网络工程',
                        },
                        {
                            value: 'Information security',
                            label: '信息安全',
                        }
                    ],
                },
                {
                    value: 'se',
                    label: '软件学院',
                    children: [
                        {
                            value: 'computer science',
                            label: '软件工程',
                        }
                    ],
                }
            ],
        }

    ];
    return (
        <div>
            <h3 class="content-title">2021年“广和通杯”华南理工大学计算机创意比赛报名</h3>
            <Form
                {...formItemLayout}
                form={form}
                name="register"
                onFinish={onFinish}
                initialValues={{
                    residence: ['学校', '学院', '专业'],
                    prefix: '86',
                }}
                scrollToFirstError
                className="signUpForm"
            >
                {/* <Form.Item
                    name="email"
                    label="联系邮箱"
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item> */}
                <Form.Item
                    name="leaderName"
                    label="队长姓名"
                    rules={[
                        {
                            required: true,
                            message: 'Please input leaderName!',
                            whitespace: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="leaderStuId"
                    label="队长学号"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your student_id!',
                        },
                    ]}
                // hasFeedback
                >
                    <Input />
                </Form.Item>
                {/* <Form.List name="teamMember" style={{}} >
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                <Form.Item
                                    {...restField}
                                    name={[name, 'teamMemberName']}
                                    fieldKey={[fieldKey, 'teamMemberName']}
                                    rules={[{ required: true, message: '必填' }]}
                                >
                                    <Input placeholder="队员姓名" />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'teamMemberStuId']}
                                    fieldKey={[fieldKey, 'teamMemberStuId']}
                                    rules={[{ required: true, message: '必填' }]}
                                >
                                    <Input placeholder="队员学号" />
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(name)} />
                            </Space>
                        ))}
                        <Form.Item >
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                添加队员（队伍最多不超过3人）
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List> */}

                <Form.Item
                    name="residence"
                    label="队长专业"
                    rules={[
                        {
                            type: 'array',
                            required: true,
                            message: 'Please select your habitual residence!',
                        },
                    ]}
                >
                    <Cascader options={residences} />
                </Form.Item>

                {/* <Form.Item
                    name="phone"
                    label="联系电话"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your phone number!',
                        },
                    ]}
                >
                    <Input
                        addonBefore={prefixSelector}
                        style={{
                            width: '100%',
                        }}
                    />
                </Form.Item> */}

                <Form.Item
                    name="teamMember"
                    label="队员备注（如有）"
                    rules={[
                        {
                            required: false,
                            message: 'Please input Intro',
                        },
                    ]}
                >
                    <Input.TextArea showCount maxLength={100} placeholder="请输入队伍队员信息，例如201830600444-张三，如有多个请按行写" />
                </Form.Item>

                <Form.Item {...tailFormItemLayout}>
                    <button
                        // type="primary" 
                        type="submit"
                        className="signUpButton"
                        onClick={() => console.log(form)}>
                        确认报名
                    </button>
                </Form.Item>
            </Form>
        </div>
    )
}

