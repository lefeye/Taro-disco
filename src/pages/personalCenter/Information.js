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
            {/* {load == false ? <div>
                <Spin indicator={spin} tip='loading' style={{ margin: '30px auto' }} />
            </div>
                : <div>

                </div>
            } */}
            <Descriptions title="个人信息" className='useInformation'>
                <Descriptions.Item label="用户姓名">Zhou Maomao</Descriptions.Item>
                <Descriptions.Item label="用户学号">1810000000</Descriptions.Item>
                <Descriptions.Item label="学院">Hangzhou, Zhejiang</Descriptions.Item>
                <Descriptions.Item label="年级">empty</Descriptions.Item>
                <Descriptions.Item label="邮箱">1262698283@qq.com</Descriptions.Item>
                <Descriptions.Item label="密码">******</Descriptions.Item>
            </Descriptions>
        </div>
    )
}

export default Info;