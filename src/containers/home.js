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
import { Modal, Button,Popover,Space,Input, message, Select } from 'antd'
import SearchSignupInfo from '../pages/personalCenter/company/SearchSignupInfo'
import DetailInfo from '../components/DetailInfo/DetailInfo'
import { ExclamationCircleOutlined, SwapOutlined,PlusOutlined,EditOutlined,UnorderedListOutlined } from '@ant-design/icons';
import new_axios from '../server/api/axios';
import url from '../server/api/url'

let role=0;
let roles=[];
let new_name='',new_remark='';
export default function Home() {
    const history = useHistory();
    const [rolename,setRoleName] = useState('');
    const [remark,setRemark] = useState('');
    const [AllRoles,setAllRoles] = useState([])
    const [isLogin, setIsLogin] = useState(store.getState().userInfo.status);
    const { confirm } = Modal;
    const [state,setState] = useState(false)
    const { Option } = Select;
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
    useEffect( () => {
        new_axios({
            method:'GET',
            url:url+'/api/v1/policy/get-all-roles'
        }).then( res => {
            if( res.data.code === '200' ){
                setAllRoles(res.data.data)
            }
            else{
                message.error('角色获取失败')
            }
        } ).catch( e => {
            console.log(e);
        } )
    } ,[state])

    const changeRoleName = value =>{
        setRoleName(value);
    }
    const changeRemark = value => {
        setRemark(value);
    }
    const handleSubmitRole = () => {
        if(!rolename||!remark){
            message.warn('角色信息未填入，请确认')
        }
        else{
            new_axios({
                method:'POST',
                url:url+'/api/v1/policy/add-role',
                data:{
                    name:rolename,
                    remark:remark
                }
            }).then( res => {
                if(res.data.code === '200'){
                    message.info(res.data.msg);
                    setState(!state);
                }
                else{
                    message.error(res.data.msg);
                }
            } ).catch( e => {
                console.log(e);
            } )
        }
    }
    const handlechange = value => {
        role=value;
    }
    const handlechange2 = value => {
        roles=value;
        console.log(roles)
    }
    const Options=(
        <Select style={{ width:'150px' }} onChange={handlechange} placeholder='选择角色'>
            {
                AllRoles.map( item => 
                    <Option value={item.id} key={item.id} >{ item.name } </Option> )
            }
        </Select>
    )
    const Options2=(
        <Select mode="multiple" allowClear style={{ width:'150px' }}onChange={handlechange2}>
            {
                AllRoles.map( item => 
                    <Option value={item.id} key={item.id} >{ item.name } </Option> )
            }
        </Select>
    )
    const ChangeRole = () => {
        Modal.destroyAll();
        confirm({
            content:
            <div>
                {Options}
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
                        message.info(res.data.msg)
                    }
                    else {
                        message.error(res.data.msg);
                    }
                } ).catch( e => {
                    console.log(e);
                } )
            },
            onCancel() {
                console.log('Cancel');
            },
            okText: "确认",
            cancelText: "取消"
        });
    }
    const editRole = () => {
        Modal.destroyAll();
        confirm({
            content:
            <div>
                <Space direction='vertical'>
                    {Options}
                    <Input 
                    placeholder='新名称'
                    onChange={ e=>{ new_name = e.target.value } }
                    ></Input>
                    <Input 
                    placeholder='备注'
                    onChange={ e=>{ new_remark = e.target.value } }
                    ></Input>
                </Space>
            </div>,
            onOk() {
                if(!new_name||!new_remark){
                    message.warn('角色信息未填入，请确认')
                }
                else{
                    new_axios({
                        method:'PUT',
                        url:url+'/api/v1/policy/update-role',
                        data:{
                            id:role,
                            name:new_name,
                            remark:new_remark
                        }
                    }).then( res => {
                        if(res.data.code==='200'){
                            message.info(res.data.msg);
                            setState(!state);
                        }
                        else{
                            message.error(res.data.msg);
                        }
                    } ).catch( e => {
                        console.log(e);
                    } )
                }
                
            },
            onCancel() {
                console.log('Cancel');
            },
            okText: "确认",
            closable:true,
            cancelText: "取消"
        });
    }
    const editRoleList = () => {
        Modal.destroyAll();
        confirm({
            content:
            <div>
                <Space direction='vertical'>
                    <span>
                        更改账号所拥有的角色列表：
                    </span>
                    {Options2}
                </Space>
            </div>,
            onOk() {
                
            },
            onCancel() {
                console.log('Cancel');
            },
            okText: "确认",
            closable:true,
            cancelText: "取消"
        });
    }
    const contentIn = (
        <div>
            <Space direction='vertical'>
                <Input placeholder='角色名称' onChange={changeRoleName}/>
                <Input placeholder='备注' onChange={changeRemark}/>
                <Button type='primary' style={{ marginLeft:'60%' }} onClick={handleSubmitRole}>确认</Button>
            </Space>
        </div>
    ) 
    const content=(
        <div >
            <Space direction='vertical' className='pop'>
                <Button type='link'icon={<SwapOutlined />}onClick={ChangeRole}>更换角色</Button>
                <Popover placement="left"  trigger="hover" content={contentIn}>
                    <Button type='link'icon={<PlusOutlined />}>添加角色</Button>
                </Popover>
                <Button type='link'icon={<EditOutlined />} onClick={editRole} >编辑角色</Button>
                <Button type='link'icon={<UnorderedListOutlined />} onClick={editRoleList} >编辑已有角色列表</Button>
            </Space>
            
        </div>
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
