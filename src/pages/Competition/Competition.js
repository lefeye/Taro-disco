import React, { useState } from 'react'
import {
    Form,
    Input,
    Modal,
    Button
} from 'antd'
import { useHistory } from 'react-router-dom'
import './index.css'
import axios from 'axios';
import url from '../../server/api/url';

export default function Competition() {
    const history = useHistory();
    const [publishTime, setPublishTime] = useState("")
    const [teamMember, setTeamMember] = useState("")
    const [visible, setVisible] = React.useState(false);
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const [form] = Form.useForm();

    const showModal = () => {
        setVisible(true);
    };

    const onFinish = (teamMember) => {
        console.log(' token ', localStorage.getItem('token'));
        // console.log('Received stu_id of form: ', values.student_id);
        axios({
            method: "POST",
            url: `${url}/api/v1/user/competition/sign-up`,
            data: {
                competition_id: 1,
                remark: teamMember
            },
            headers: {
                'token': localStorage.getItem('token'),
            }
        })
            .then(res => {
                if (res.data.status == '200')
                    console.log('报名成功')
                else {
                    console.log('报名失败，请检查是否登录')
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
            <h3 class="content-title">2021年“广和通杯”华南理工大学计算机创意比赛</h3>
            <h5 class="content-date">发布时间：{publishTime ? publishTime : "---"}</h5>
            <hr></hr>
            <p className="content-body">
                <span>程序设计赛道采用 ACM-ICPC 赛制</span>
                <br />
                为了鼓励更多人参与，本次大赛设置了不同难度的赛场，参赛选手可根据自己当前的实力任选一场参赛。
                不管你是“黄金”段位还是“王者”大神，只要你对算法感兴趣，并且至少掌握一种程序设计语言，就能够参加本次大赛。
                重点考察选手的算法和程序设计能力，不考察实际工程中常用的系统编程，多线程编程等等；
                程序设计赛道要求参赛者使用程序设计语言（包括：Java、C/C++、Python）解决挑战性算法问题。程序完成之后提交运行，系统自动判定程序为正确或错误并将运行的结果反馈给参赛者，根据解题数和答题耗时进行排名。
                <br />
                <span>参赛费用：</span>
                <br />
                本次竞赛不收取任何费用，总决赛参赛人员的差旅及食宿费用自行承担。
                <br />
                <span>参赛规则：</span>
                <br />

                1.每场比赛均为3小时。在这3小时内，参赛者需使用规定的程序设计语言（仅包括C、C++（C++11/C++14）、Python（Python2/Python3）和Java），按照规定时间内在线上竞赛平台在线CODING，解决若干道挑战性算法问题。参赛者完成每道题后，对代码提交运行，系统将自动判定程序为正确或错误并将运行的结果反馈给参赛者。初赛的每场比赛结束后，系统将根据参赛者的答题准确率和答题耗时，对参赛者进行排名。
                <br />2. 最终排名等于解出题目数量更多的选手排名靠前。解题数量相同时，罚时少的选手排名靠前。因此请尽早提交，并尽可能减少提交次数。
                <br />3. 大赛主办方有权结合参赛者报名情况、竞赛情况等实际因素，调整晋级复赛的人数。

                <br /><span>参赛对象：</span>
                <br />
                大赛面向中国高校所有专业的在校生（含高职、大专、本科及研究生），具体要求如下：
                1. 参赛者在报名时需具有在校学籍，已毕业的学生也可参加体验，但不具备评奖资格。
                2. 参赛者应保证报名时填写的信息准确有效，并依据参赛系统要求完成“在校学生实名认证”。
                3. 参赛者须遵守所在学校、地区关于学生参加校外活动之规定。
                4. 大赛技术支持单位及有机会接触到比赛试题及数据的人员不具备参赛报名资格。

                *在程序设计赛道中，参赛者须以团队名义参赛。
            </p>
            {/*<Button type="primary"
                style={{ borderRadius: '10px', height: '40px', width: '200px' }}
                onClick={() => history.push('/home/signUp')}>立即报名</Button>
             <Button onClick={history.push('/')}>提交作品</Button> */}
            <div style={{textAlign:'center'}}>
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

                    {/* <Form.Item {...tailFormItemLayout}>
                        <button
                            // type="primary" 
                            type="submit"
                            className="signUpButton"
                            onClick={() => console.log(form)}>
                            确认报名
                        </button> 
                </Form.Item>*/}
                </Form>
            </Modal>
        </div >
    )
}
