import './PersonalCenter.css'
import React, { useState, useEffect } from 'react';
import Information from './Information.js';
import axios from 'axios';
import MyNavLink from '../../components/MyNavLink';
import PersonalBookingInfo from './student/PersonalBookingInfo'
import MyApply from './student/MyApply';
import AllApply from './admin/AllApply'
import BookingManage from './admin/BookingManage';
import LabManage from './admin/LabManage';
import Annoucement from './admin/Annoucement';
import Alluser from './admin/Alluser';
import ElectricMonitor from './admin/ElectricMonitor'

import { Menu, Badge, Avatar } from 'antd';
import {
    IdcardOutlined,
    CalendarOutlined,
    DatabaseOutlined
} from '@ant-design/icons';
import { Route, Switch } from 'react-router-dom';
import store from '../../redux/store';
import url from './../../server/api/url';


const PersonalCenter = () => {
    const typeofUser = store.getState().userInfo.typeofUser
    const account = store.getState().userInfo.account;
    const [applyNum, setApplyNum] = useState(0);
    console.log(typeofUser)
    useEffect(() => {
        const URL = url + `/getApply?limit=10&page=1`;
        axios({
            method: "get",
            url: URL,
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then(response => {
                let number = 0;
                response.data.data.forEach(item => {
                    if (item.status == '0')
                        number++;
                });
                setApplyNum(number);
                console.log(number)
            })
            .catch(function (error) {
                console.log(1)
                console.log(error);
            });
    })
    return (
        <div className="father">
            <div className="info">
                <Switch>
                    <Route path='/home/personalcenter/information' component={Information} />
                    <Route path='/home/personalcenter/personalBookingInfo' component={PersonalBookingInfo} />
                    <Route path='/home/personalcenter/bookingManage' component={BookingManage} />
                    <Route path='/home/personalcenter/labManage' component={LabManage} />
                    <Route path='/home/personalcenter/annoucements' component={Annoucement} />
                    <Route path='/home/personalcenter/allusers' component={Alluser} />
                    <Route path='/home/personalcenter/apply' component={AllApply} />
                    <Route path='/home/personalcenter/myMpply' component={MyApply} />
                    <Route path='/home/personalcenter/labManage' component={LabManage} />
                    <Route path='/home/personalcenter/electricMonitor' component={ElectricMonitor} />
                </Switch>
            </div>
            <div className="menu">
                <Menu
                    style={{ width: 200, height: '100vh' }}
                    defaultOpenKeys={['sub1']}
                    mode='vertical'
                    theme='light'
                >
                    <Menu.Item key="1" icon={<IdcardOutlined />} style={{ marginBottom: '10px' }}>
                        <MyNavLink to='/home/personalcenter/information'>个人信息</MyNavLink>
                    </Menu.Item>
                    {typeofUser !== 1 ?
                        <><Menu.Item key="2" icon={<CalendarOutlined />}>
                            <MyNavLink to='/home/personalcenter/personalBookingInfo'>预约记录</MyNavLink>
                        </Menu.Item>
                            <Menu.Item key="7" icon={<CalendarOutlined />}>
                                <MyNavLink to='/home/personalcenter/myMpply'>我的申请</MyNavLink>
                            </Menu.Item></>
                        : ''}
                    {
                        account === '201820220001' ? <Menu.Item key="3" icon={<DatabaseOutlined />}>
                            <MyNavLink to='/home/personalcenter/allusers'>用户管理</MyNavLink>
                        </Menu.Item> : ''
                    }

                    {(typeofUser === 1 || typeofUser === 3) ?
                        <>

                            <Menu.Item key="4" icon={<CalendarOutlined />}>
                                <>
                                    <MyNavLink to='/home/personalcenter/bookingManage'>预约管理</MyNavLink></>
                            </Menu.Item>
                            <Menu.Item key="5" >
                                <Badge count={applyNum}>
                                    <Avatar shape="square" size='small' icon={<DatabaseOutlined />} />
                                </Badge><MyNavLink to='/home/personalcenter/apply'>申请审核</MyNavLink>
                            </Menu.Item>
                            <Menu.Item key="6" icon={<DatabaseOutlined />}>
                                <MyNavLink to='/home/personalcenter/annoucements'>公告管理</MyNavLink>
                            </Menu.Item>
                            <Menu.Item key="8" icon={<DatabaseOutlined />}>
                                <MyNavLink to='/home/personalcenter/labManage'>实验室管理</MyNavLink>
                            </Menu.Item>
                            <Menu.Item key="9" icon={<DatabaseOutlined />}>
                                <MyNavLink to='/home/personalcenter/electricMonitor'>电表监控</MyNavLink>
                            </Menu.Item>
                        </> : ''}

                </Menu>
            </div>


        </div>
    );
};

export default PersonalCenter;