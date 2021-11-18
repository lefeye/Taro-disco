import React, { useEffect, useState } from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from '../pages/Home/Home'
import Contact from '../pages/Contact/Contact'
import Download from '../pages/Download/Download'
import Question from '../pages/Question/Question'
import User from '../pages/User/index'
import SignUp from '../pages/SignUp/index'
import img2 from '../imgs/lab.png'
import MyNavLink from '../components/MyNavLink'
import img1 from '../imgs/scut0.png'
import PersonalCenter from './personalCenter/PersonalCenter'
import store from '../redux/store'

export default function Home1() {

    const [isLogin]=useState(store.getState().status);
    return (
        <div>
            <div className="top">
                <MyNavLink to="/login">登录</MyNavLink>
                <MyNavLink to="/register">注册</MyNavLink>
                <MyNavLink to="/home/personalcenter">个人中心</MyNavLink>
                <MyNavLink to="/home/signUp">比赛报名</MyNavLink>

            </div>
            <header className="App-header">
                <div className="club_title">
                    <img src={img1} alt="scut" style={{width:'15%'}}/>
                    <div>
                        <img src={img2} alt="lab" style={{height:'20%',width:'100%'}}/>
                    </div>
                </div>
            </header >
            <div className="top">
                <MyNavLink to="/home/home">首页</MyNavLink>
                <MyNavLink to="/home/question">更多问题</MyNavLink>
                <MyNavLink to="/home/download">资源下载</MyNavLink>
                <MyNavLink to="/home/contact">联系我们</MyNavLink>

            </div>
            <div className="router-content">
                <Switch>
                    <Route path='/home/' component={Home} exact />
                    <Route path='/home/home' component={Home} />
                    <Route path="/home/question" component={Question} />
                    <Route path="/home/download" component={Download} />
                    <Route path="/home/contact" component={Contact} />
                    <Route path="/home/signUp" component={SignUp} />
                    {/* <Route path="/home/user" component={User} /> */}
                    <Route path='/home/personalcenter' component={PersonalCenter} />
                </Switch>
            </div>
        </div>
    )
}
