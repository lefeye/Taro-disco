import React, { useState } from 'react';
import store from '../redux/store';
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
    const [form] = Form.useForm();
    const { Option } = Select;
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        console.log('Received stu_id of form: ', values.student_id);
    };
    const sendFormToBackend = () => {

    }
    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
            <Select
                style={{
                    width: 70,
                }}
            >
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        </Form.Item>
    );
    const formItemLayout = {
        labelCol: {
            xs: {
                span: 24,
            },
            sm: {
                span: 8,
            },
        },
        wrapperCol: {
            xs: {
                span: 24,
            },
            sm: {
                span: 16,
            },
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
            <Form.Item
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
            </Form.Item>
            <Form.Item
                name="name"
                label="队长姓名"
                rules={[
                    {
                        required: true,
                        message: 'Please input your nickname!',
                        whitespace: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="student_id"
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
            <Form.List name="users" style={{}}>
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
                                    name={[name, 'teamMemberStu_id']}
                                    fieldKey={[fieldKey, 'teamMemberStu_id']}
                                    rules={[{ required: true, message: '必填' }]}
                                >
                                    <Input placeholder="队员学号" />
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(name)} />
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                添加队员（队伍最多不超过3人）
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>



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

            <Form.Item
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
            </Form.Item>

            <Form.Item
                name="intro"
                label="Intro"
                rules={[
                    {
                        required: false,
                        message: 'Please input Intro',
                    },
                ]}
            >
                <Input.TextArea showCount maxLength={100} placeholder="队伍简介" />
            </Form.Item>


            <Form.Item label="Captcha" extra="获取验证码并输入">
                <Row gutter={8}>
                    <Col span={12}>
                        <Form.Item
                            name="captcha"
                            noStyle
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input the captcha you got!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Button>Get captcha</Button>
                    </Col>
                </Row>
            </Form.Item>

            <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                    {
                        validator: (_, value) =>
                            value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
                    },
                ]}
                {...tailFormItemLayout}
            >
                <Checkbox>
                    I have read the <a href="">agreement（比赛说明）</a>
                </Checkbox>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" onClick={() => console.log(form)}>
                    Register
                </Button>
            </Form.Item>
        </Form>
    )
}

