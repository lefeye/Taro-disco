import React, { useState, useEffect } from 'react';
// import CheckCalendar from '../../../components/CheckCalendar';
import url from '../../../server/api/url';
import axios from 'axios';
import store from '../../../redux/store'
import { message, Tabs, Form, Input, Button, Select } from 'antd';

export default function lab_351() {
    // const [showCalendar, setShowCalendar] = useState(true)
    const [reversedDate, setReversedDate] = useState([])
    const [userInfo, setUserInfo] = useState(store.getState().userInfo)
    const { TabPane } = Tabs;
    const { Option } = Select;
    const [children, setChildren] = useState([])
    useEffect(() => {
        const URL1 = url + '/getInfoByAccount'
        axios({
            method: "POST",
            url: URL1,
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('token')
            },
            data: {
                "Account": userInfo.account
            }
        }
        ).then(data => {
            console.log(data.data)
            if (data.data.status === "BS2012") {
                const userInformation = data.data.data;
                setUserInfo(userInformation);
                console.log(userInformation)
            }
            else {
                console.error('网络出错,查询个人信息失败!')
            }
        }).catch(e => {
            console.log('error')
            console.log(e)
        })
    }, [])
    useEffect(() => {
        const URL2 = url + "/searchApply"
        axios({
            method: "POST",
            url: URL2,
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('token')
            },
            data: {
                "lab_name": "b3-351"
            }
        })
            .then(response => {
                const data = response.data.data;
                console.log(data)
                setReversedDate(data);
            })
            .catch(function (error) {
                console.log(1)
                console.log(error);
            });
    }, [])
    useEffect(() => {
        const today = new Date();
        const dateArr = [];
        for (let i = 0; i < 31; i++) {
            const newDate = new Date(today.getTime() + i * 1000 * 60 * 60 * 24)
            const year = newDate.getFullYear()
            const month = (parseInt(newDate.getMonth()) + 1) > 9 ? (parseInt(newDate.getMonth()) + 1) : "0" + (parseInt(newDate.getMonth()) + 1)
            const day = (newDate.getDate()) > 9 ? newDate.getDate() : "0" + newDate.getDate()
            const fullDate = `${year}-${month}-${day}`
            dateArr.push(<Option key={i + 'kk'}>{fullDate}</Option>)
        }
        dateArr.shift();
        console.log(dateArr);
        setChildren(dateArr);
    }, [])
    const sendApply = (e) => {
        const URL3 = url + "/applyForLab"
        axios({
            method: "POST",
            url: URL3,
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('token')
            },
            data: {
                "account": userInfo.account,
                "lab_name": "b3-351",
                "description": e.teamNumber,
                "dates": reversedDate
            }
        })
            .then(response => {
                if (response.data.status == 'BS2024');
                message.success('申请已提交,请等待审核结果')

            })
            .catch(function (error) {
                message.error('网络错误,请检查网络后重新提交申请')
                console.log(error);
            });
    }
    const callback = (key) => {
        console.log(key);
    }
    const onFinish = (values) => {
        console.log('Success:', values);
        sendApply(values)
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const handleChange = (value) => {
        console.log(`selected ${value}`);
        let str = ''
        value.forEach(i => str += ',' + i)
        str.charAt(1)
        console.log(str);
        setReversedDate(str)
    }
    return <div>
        {/* <CheckCalendar
            visible={showCalendar}
            onClose={setShowCalendar(false)}
            onConfirm={(isCheck) => {
                console.log(isCheck)
                setShowCalendar(false)
            }}
        /> */}
        <h1>B3-351实验室</h1>
        <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="申请须知" key="1">
                351为...实验室
            </TabPane>
            <TabPane tab="提交申请" key="2">
                <h4>申请信息</h4>
                {/* <div>{checkApply}</div> */}
                {/* <div> */}
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    style={{ width: '80%' }}
                >
                    <Form.Item
                        label="申请人学号："
                        name="account"

                    >
                        {userInfo.account}
                    </Form.Item>

                    <Form.Item
                        label="申请人姓名"
                        name="name"
                    >
                        {userInfo.Name}
                    </Form.Item>

                    <Form.Item
                        label="申请时间"
                        name="date"
                    >
                        {/* 写时间表 */}
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            // defaultValue={['2022-05-01', '2022-05-02', '2022-05-03']}
                            onChange={handleChange}
                        >
                            {children}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="团队信息"
                        name="teamInfo"
                    >
                        <Input.TextArea placeholder="姓名-学号，多人情况以逗号分隔,按人数填。个人申请可不填" showCount maxLength={100} />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            提交申请
                        </Button>
                    </Form.Item>
                </Form>
                {/* </div> */}
            </TabPane>
        </Tabs>
    </div >;
}
