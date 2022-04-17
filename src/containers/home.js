import React, { useState } from 'react'
import { Link, Route, Switch, useHistory } from 'react-router-dom'
import HomePage from '../pages/HomePage/index'
import Contact from '../pages/Contact/Contact'

import MyNavLink from '../components/MyNavLink'
import Weather from '../components/Weather/index'
import PersonalCenter from '../pages/personalCenter/PersonalCenter'
import SeatReservation from '../pages/seatReservation/index'
import Monitor from "../pages/Monitor"
import store from '../redux/store'
import { Modal, Button } from 'antd'
import TemperatureHumidity from '../pages/TemperatureHumidity/index'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import './home.css';

export default function Home() {
    const history = useHistory()
    const [isLogin, setIsLogin] = useState(store.getState().userInfo.status);
    const [isAdministrators, setIsAdministrators] = useState(store.getState().userInfo.typeofUser == "1" ? true : false);
    const { confirm } = Modal;
    console.log(store.getState().userInfo.typeofUser)
    //退出登录
    const logout = () => {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <p>确认退出登录？</p>,
            onOk() {
                const action = {
                    type: 'clear_userInfo',
                }
                localStorage.clear();
                sessionStorage.clear();
                store.dispatch(action)
                setIsLogin(false)
                history.push('/home');
            },
            onCancel() {
                console.log('Cancel');
            },
            okText: "确认",
            cancelText: "取消"
        });

        // console.log('logout   ', 'islogin:', store.getState().userInfo.status)
    }

    return (
        <div className='all'>
            <div className="top">
                {isLogin ? <></> : <MyNavLink to="/login">登录</MyNavLink>}
                {isLogin ? <MyNavLink to="/home/personalcenter/information">个人中心</MyNavLink> : <></>}
                {isLogin ? <Button type="link" onClick={logout}>退出登录</Button> : ''}
            </div>
            <Weather className='weather' positive='out' />
            <Weather className='weather' positive='in' />
            <header className="App-header">

                <span className="club_title">
                    智能系统未来创新实验室管理系统
                </span>

            </header >
            <div className="nav">
                <Link to="/home">首页</Link>
                <Link to="/home/seatReservation">座位预约</Link>
                {isAdministrators ? <Link to="/home/temperature_humidity">实验室温湿度</Link> : <></>}
                <Link to="/home/monitor">监控查看</Link>
                <Link to="/home/contact">预约规则</Link>
            </div>
            <div className="router-content">
                <Switch>
                    <Route exact path='/home/' component={HomePage} />
                    <Route path='/home/seatReservation' component={SeatReservation} />
                    <Route path='/home/temperature_humidity' component={TemperatureHumidity} />
                    <Route path='/home/personalcenter' component={PersonalCenter} />
                    <Route path="/home/contact" component={Contact} />
                    <Route path="/home/monitor" component={Monitor} />
                </Switch>
            </div>

        </div>
    )
}
