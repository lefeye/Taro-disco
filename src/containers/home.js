import React, { useState } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import HomePage from '../pages/HomePage/index'
import Contact from '../pages/Contact/Contact'
import Download from '../pages/Download/Download'
import Question from '../pages/Question/Question'
// import SignUp from '../pages/SignUp/SignUp'
import Competition from '../pages/Competition/Competition'
import MyNavLink from '../components/MyNavLink'
import PersonalCenter from '../pages/personalCenter/PersonalCenter'
import store from '../redux/store'
import imgleft from '../imgs/logo_left.png'
import { Modal, Button } from 'antd'
import SearchSignupInfo from '../pages/personalCenter/company/SearchSignupInfo'
import DetailInfo from '../components/DetailInfo/DetailInfo'
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default function Home() {
    const history = useHistory()
    const [isLogin, setIsLogin] = useState(store.getState().userInfo.status);
    const { confirm } = Modal;
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
                console.log('OK');
                history.push('/home/homepage');
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
        <div>
            <div className="top">
                {isLogin ? <></> : <MyNavLink to="/login">登录</MyNavLink>}
                {isLogin ? <></> : <MyNavLink to="/register">注册</MyNavLink>}
                {isLogin ? <MyNavLink to="/home/personalcenter/information">个人中心</MyNavLink> : ''}
                {isLogin ? <Button type="link" onClick={logout}>退出登录</Button> : ''}
            </div>
            <header className="App-header">
                <div className="club_title">
                    <img src={imgleft} alt="logo_left" style={{ height: '20%' }} />
                    智能系统未来创新实验室
                </div>
            </header >
            <div className="nav">
                <MyNavLink to="/home/homepage">首页</MyNavLink>
                <MyNavLink to="/home/competition">比赛资讯</MyNavLink>
                <MyNavLink to="/home/download">资源下载</MyNavLink>
                <MyNavLink to="/home/contact">联系我们</MyNavLink>
                <MyNavLink to="/home/question">更多问题</MyNavLink>

            </div>
            <div className="router-content">
                <Switch>
                    {/* <Redirect path='/home' to="/home/homepage" /> */}
                    <Route exact path='/home/' component={HomePage} />
                    <Route path='/home/homepage' component={HomePage} />
                    <Route path='/home/competition' component={Competition} />
                    <Route path="/home/question" component={Question} />
                    <Route path="/home/download" component={Download} />
                    <Route path="/home/contact" component={Contact} />
                    <Route path='/home/searchsignupinfo' component={SearchSignupInfo} />
                    <Route path='/home/detail' component={DetailInfo} />
                    <Route path='/home/personalcenter' component={PersonalCenter} />

                </Switch>
            </div>
        </div>
    )
}
