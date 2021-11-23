import React, { useEffect, useState } from 'react'
import { Route, Switch } from 'react-router-dom'
import HomePage from '../pages/HomePage/index'
import Contact from '../pages/Contact/Contact'
import Download from '../pages/Download/Download'
import Question from '../pages/Question/Question'
// import SignUp from '../pages/SignUp/SignUp'
import Competition from '../pages/Competition/Competition'
import MyNavLink from '../components/MyNavLink'
import PersonalCenter from './personalCenter/PersonalCenter'

import imgleft from '../imgs/logo_left.png'

export default function Home() {
    const [isLogin] = useState(0);
    return (
        <div>
            <div className="top">
                <MyNavLink to="/login">登录</MyNavLink>
                <MyNavLink to="/register">注册</MyNavLink>
                <MyNavLink to="/home/personalcenter">个人中心</MyNavLink>
                {/* <MyNavLink to="/home/signUp">比赛报名</MyNavLink> */}

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
                    <Route exact path='/home/' component={HomePage} />
                    <Route path='/home/homepage' component={HomePage} />
                    <Route path='/home/competition' component={Competition} />
                    <Route path="/home/question" component={Question} />
                    <Route path="/home/download" component={Download} />
                    <Route path="/home/contact" component={Contact} />
                    {/* <Route path="/home/signUp" component={SignUp} /> */}
                    <Route path='/home/personalcenter' component={PersonalCenter} />

                </Switch>
            </div>
        </div>
    )
}
