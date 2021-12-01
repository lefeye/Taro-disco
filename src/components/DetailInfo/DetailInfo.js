import React, { useEffect, useState } from 'react'
import {
    Form,
    Input,
    Modal,
    Button,
    message,
} from 'antd'
// import { useHistory } from 'react-router-dom'
import './DetailInfo.css'
import axios from 'axios';
import url from '../../server/api/url';

export default function DetailInfo() {
    // const history = useHistory();
    // const [publishTime, setPublishTime] = useState("")
    const [teamMember, setTeamMember] = useState("")
    const [visible, setVisible] = React.useState(false);
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    // const [form] = Form.useForm();
    const [data, setData] = useState({});
    const compId = sessionStorage.getItem('compId');
    const [ifparticipate, setIfparticipate] = React.useState(false);
    const [ifSignUp, setIfSignUp] = React.useState(false);

    useEffect(() => {
        axios({
            method: "GET",
            url: `${url}/api/v1/user/competition?competition_id=${compId}`,
            headers: {
                'token': sessionStorage.getItem('token')
            }
        }).then(data => {
            if (data.data.status === 200) {
                const data1 = data.data.data;
                console.log(data1);
                setData(data1);
            }
        }).catch(e => {
            console.log(e)
        })
    }, [])

    useEffect(() => {
        axios({
            method: "GET",
            url: `${url}/api/v1/user/own/competition`,
            headers: {
                'token': sessionStorage.getItem('token')
            }
        }).then(data => {
            console.log(data.data.data)
            data.data.data.forEach(element => {
                if (element["id"] == compId) {
                    setIfparticipate(true);
                }
            });
        })
    }, [ifSignUp])

    const showModal = () => {
        if (sessionStorage.getItem('token'))
            setVisible(true);
        else {
            message.info('请先登录！');
        }
    };

    const onFinish = (teamMember) => {
        console.log(' token ', sessionStorage.getItem('token'));
        // console.log('Received stu_id of form: ', values.student_id);
        axios({
            method: "POST",
            url: `${url}/api/v1/user/competition/sign-up`,
            data: {
                competition_id: parseInt(compId),
                remark: teamMember
            },
            headers: {
                'token': sessionStorage.getItem('token'),
            }
        })
            .then(res => {
                console.log(res)
                if (res.data.status === '200'){
                    message.info('报名成功')
                    setIfparticipate(true);
                }

                else {
                    message.error('报名失败，请检查是否登录')
                    console.log(res)
                }
            }).catch(e => console.log(e))
    };

    const handleOk = () => {
        if (teamMember.length) {
            onFinish(teamMember);
            setConfirmLoading(true);
            setTimeout(() => {
                setVisible(false);
                setConfirmLoading(false);
            }, 2000);
        }
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setVisible(false);
    };

    return (
        <div>
            <h3 class="content-title">{data.title}</h3>
            {/* <h5 class="content-date">发布时间：{publishTime ? publishTime : "---"}</h5> */}
            <hr></hr>
            <p className="content-body">
                <span>比赛描述</span>
                <br />
                {data.description}
                <br />
                <span>参赛要求</span>
                <br />
                {data.entry_requirement}
                <br />
                <span>作品要求</span>
                <br />

                {data.work_requirement}
                <br /><span>奖励</span>
                <br />
                {data.reward}
                <br /><span>报名截止时间</span>
                <br />
                {data.signup_deadline}
                <br /><span>比赛截止时间</span>
                <br />
                {data.submit_deadline}
            </p>
            {ifparticipate ?
                <Button type="primary" disabled
                    style={{
                        display: 'block', margin: 'auto',
                        textAlign: 'center'
                    }}>
                    (您已报名)
                </Button> : <>

                    <div style={{ textAlign: 'center' }}>
                        <Button type="primary" onClick={showModal} >
                            立即报名
                        </Button>
                    </div>
                    <Modal
                        title="报名确认"
                        visible={visible}
                        onOk={handleOk}
                        confirmLoading={confirmLoading}
                        onCancel={handleCancel}
                    >
                        <Form onChange={(value) => setTeamMember(value.target.value)}>
                            <Form.Item
                                name="teamMember"
                                label="队员信息"
                                rules={[
                                    {
                                        required: true,
                                        message: '本赛事以组队形式参加，请务必填写队员信息',
                                    },
                                ]}
                            >
                                <Input.TextArea showCount maxLength={100} placeholder="请输入队伍队员信息，例如201830600444-张三，如有多个请按行写" />
                            </Form.Item>
                        </Form>
                    </Modal></>
            }
        </div >
    )
}