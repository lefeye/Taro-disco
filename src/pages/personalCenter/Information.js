import axios from 'axios';
import React, { useState, useEffect } from 'react';
import url from '../../server/api/url'
import './Information.css'
import {
    Button,
    Descriptions
} from 'antd'
import store from '../../redux/store'

function Information() {
    const [user, setUser] = useState({})
    const [load, setLoad] = useState(true);  //加载中
    // const [account, userType] = store.getState().userInfo;
    const queryPersonalInformation = () => {
        console.log(store.getState().userInfo.account)
        const URL = url + '/getInfoByAccount'
        axios({
            method: "POST",
            url: URL,
            data: {
                "Account": store.getState().userInfo.account//redux构建好后改
            },
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('token')
            }
        }
        ).then(data => {
            console.log(data.data)
            if (data.data.status === "BS2012") {
                const userInformation = data.data.data;
                setLoad(false);
                setUser(userInformation);
                console.log(userInformation)
            }
            else {
                console.error('查询个人信息失败！')
            }
        }).catch(e => {
            console.log('error')
            console.log(e)
        })
    }
    useEffect(() => {
        queryPersonalInformation();
        console.log(user)
    }, [])
    return (

        <div>
            <Descriptions
                title="个人信息"
                bordered
                layout="vertical"
                column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                style={{ width: '90%', margin: 'auto' }}
            >
                <Descriptions.Item label="姓名">{user.Name}</Descriptions.Item>
                <Descriptions.Item label="邮箱">{user.Email}</Descriptions.Item>
                <Descriptions.Item label="学号">{user.account}</Descriptions.Item>
                <Descriptions.Item label="年级">{user.Grade}</Descriptions.Item>
                <Descriptions.Item label="联系方式">{user.Telephone}</Descriptions.Item>
                <Descriptions.Item label="学院">{user.College}</Descriptions.Item>
            </Descriptions>
            <br />
            {/* <Button className='editInfo'>修改个人信息</Button> */}
        </div>
    )
}

export default Information;