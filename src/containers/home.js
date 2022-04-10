import React, { useEffect, useState } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import HomePage from '../pages/HomePage/index'
import Contact from '../pages/Contact/Contact'
import Download from '../pages/Download/Download'
import Question from '../pages/Question/Question'
import Competition from '../pages/Competition/Competition'
import MyNavLink from '../components/MyNavLink'
import PersonalCenter from '../pages/personalCenter/PersonalCenter'
import store from '../redux/store'
import imgleft from '../imgs/logo_left.png'
import DetailNotice from '../components/DetailNotice'
import { Modal, Button,Popover,Space,Input, message, Select, Layout } from 'antd'
import SearchSignupInfo from '../pages/personalCenter/company/SearchSignupInfo'
import DetailInfo from '../components/DetailInfo/DetailInfo'
import { ExclamationCircleOutlined, SwapOutlined  } from '@ant-design/icons';
import new_axios from '../server/api/axios';
import url from '../server/api/url'

let role=0;
export default function Home() {
    const history = useHistory();
    const [myRoles,setMyRoles] = useState([])
    const [isLogin, setIsLogin] = useState(store.getState().userInfo.status);
    const { confirm } = Modal;
    const [currentRole,setCurrentRole] = useState({});
    const { Option } = Select;
    const logout = () => {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <p>确认退出登录？</p>,
            onOk() {
                new_axios({
                    method:'POST',
                    url:url+'/logout',
                }).then( res => {
                    if(res.data.code === '200'){
                        message.info('已退出')
                    }
                    else{
                        message.warn('网络不稳定，已为您强制退出')
                    }
                } )
                const action = {
                    type: 'clear_userInfo',

                }
                localStorage.clear();
                sessionStorage.clear();
                store.dispatch(action)
                setIsLogin(false)
                history.push('/home');
            },
            okText: "确认",
            cancelText: "取消"
        });

    }
    
    useEffect( () => {
        new_axios({
            method:'GET',
            url:url+'/api/v1/get-info'
        }).then( res => {
            if( res.data.code === '200' ){

                sessionStorage.setItem('userId',res.data.data.role.id);
                setCurrentRole(res.data.data.role);
                 const ids=[];
                if(res.data.data.roles){
                    setMyRoles(res.data.data.roles);
                    res.data.data.roles.forEach(element => {
                        ids.push(element.id);
                    });
                }
                

            }
            else{
                message.error('角色获取失败')
            }
        } ).catch( e => {
            console.log(e);
        } )
    } ,[])

    const handlechange = value => {
        role=value;
    }

    const Options=(
        <Select style={{ width:'150px' }} onChange={handlechange} placeholder='选择角色' defaultValue={currentRole.id}>
            {
                myRoles.map( item => 
                    <Option value={item.id} key={item.id} >{ item.name } </Option> )
            }
        </Select>
    )

    const ChangeRole = () => {
        Modal.destroyAll();
        confirm({
            content:
            <div>
                <Space direction='vertical'>
                    <span>当前：{currentRole.name}</span>
                    <span>只能切换您角色组内的角色</span>
                    {Options}
                </Space>
                
            </div>,
            onOk() {
                new_axios({
                    method:'POST',
                    url:url+'/api/v1/policy/change-role',
                    data:{
                        role_id:role
                    }
                }).then( res => {
                    if( res.data.code === '200' ){
                        message.info(res.data.msg);
                        const data = sessionStorage.getItem('persist:root');
                        sessionStorage.clear();
                        sessionStorage.setItem('persist:root',data);
                        sessionStorage.setItem('token',res.data.data.token);
                        history.push('/home');
                    }
                    else {
                        message.error(res.data.msg);
                    }
                } ).catch( e => {
                    console.log(e);
                } )
            },
            okText: "确认",
            cancelText: "取消"
        });
    }

    const content=(
        <Button type='link' className='changeBtn' onClick={ChangeRole}>{<SwapOutlined />}更换角色</Button>
    )
    

    return (
        <div>
            <div className="top">
                {isLogin ? 
                <Popover placement="bottom"  trigger="hover" content={content}>
                    <a>角色编辑</a>
                </Popover> : <></>}
                {isLogin ? <></> : <MyNavLink to="/login">登录</MyNavLink>}
                {isLogin ? <></> : <MyNavLink to="/register">注册</MyNavLink>}
                
                {isLogin ? <MyNavLink to="/home/personalcenter/information">个人中心</MyNavLink> : ''}
                {isLogin ? <Button type="link" onClick={logout}>退出登录</Button> : ''}
            </div>
            <header className="App-header">
                <div >
                    <img src={imgleft} alt="logo_left" style={{ width:'30vw',height:'14vh' }} />
                </div>
                <div className="club_title">
                    智能系统未来创新实验室
                </div>
            </header >
            <div className="nav">
                <MyNavLink to="/home/homepage">首页</MyNavLink>
                <MyNavLink to="/home/competition">比赛资讯</MyNavLink>
                <MyNavLink to="/home/notice">通知公告</MyNavLink>
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
                    <Route path="/home/notice" component={Download} />
                    <Route path="/home/contact" component={Contact} />
                    <Route path='/home/searchsignupinfo' component={SearchSignupInfo} />
                    <Route path='/home/detail' component={DetailInfo} />
                    <Route path='/home/personalcenter' component={PersonalCenter} />
                    <Route path='/home/detailnotice' component={DetailNotice} />
                </Switch>
            </div>
        </div>
    )
}
