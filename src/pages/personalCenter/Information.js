import axios from 'axios';
import React, { useState } from 'react';
import url from '../../server/api/url'
import './Information.css'
import {
    Spin,
    Descriptions
} from 'antd'

function Info() {
    const [user, setUser] = useState({})
    const [load, setLoad] = useState(true);  //加载中
    const queryPersonalInformation = () => {
        axios({
            method: "GET",
            url: `${url}/api/v1/setting/competition/get-list`,
            headers: {
                'token': sessionStorage.getItem('token')
            }
        }).then(data => {
            if (data.data.status === 200) {
                const userInformation = data.data.data;
                setLoad(false);
                setUser(userInformation);
            }
            else {
                console.error('查询个人信息失败！')
            }
        }).catch(e => {
            console.log(e)
        })
    }
    return (

        <div>
            <Descriptions
            title="个人信息"
            bordered
            layout="vertical"
            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            >
            <Descriptions.Item label="姓名">abc</Descriptions.Item>
            <Descriptions.Item label="邮箱">halomai@163.com</Descriptions.Item>
            <Descriptions.Item label="学号">201830581343</Descriptions.Item>
            <Descriptions.Item label="学院">计算机科学与工程学院</Descriptions.Item>
            <Descriptions.Item label="年级">18级</Descriptions.Item>
            <Descriptions.Item label="密码">******</Descriptions.Item>
            </Descriptions>
        </div>
    )
}

export default Info;