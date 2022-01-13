import './PersonalCenter.css'
import React, { useEffect, useState } from 'react';
import Info from './Information';
import PersonalContest from './PersonanlContest';
import MyNavLink from '../../components/MyNavLink';
import ReleaseCompetition from './company/ReleaseCompetition';
import Released from './company/Released';
import TeamManage from './student/TeamManage';
import { Menu } from 'antd';
import EditableTable from './superManager/Management';
import SuTeamManage from './superManager/SuTeamManage';
import {
    IdcardOutlined,
    CalendarOutlined,
    DatabaseOutlined,
    TeamOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Route, Switch } from 'react-router-dom';
import store from '../../redux/store';

const PersonalCenter = () => {
    const [key,setKey] = useState('1')
    const typeofUser = store.getState().userInfo.typeofUser
    useEffect( () => {
        const path=window.location.pathname;
        if(path.indexOf('information')!==-1){
            setKey('1');
        }
        if(path.indexOf('personalcontest')!==-1){
            setKey('2');
        }
        if(path.indexOf('competition')!==-1){
            setKey('3');
        }
        if(path.indexOf('released')!==-1){
            setKey('4');
        }
        if(path.indexOf('management')!==-1){
            setKey('5');
        }
        if(path.indexOf('teammanage')!==-1){
            setKey('6');
        }
        if(path.indexOf('suteam')!==-1){
            setKey('7');
        }
    } )
    return (
        <div className="father">
            <div className="info">
                <Switch>
                    <Route path='/home/personalcenter/information' component={Info} />
                    <Route path='/home/personalcenter/personalcontest' component={PersonalContest} />
                    <Route path='/home/personalcenter/competition' component={ReleaseCompetition} />
                    <Route path='/home/personalcenter/released' component={Released} />
                    <Route path='/home/personalcenter/management' component={EditableTable} />
                    <Route path='/home/personalcenter/teammanage' component={TeamManage} />
                    <Route path='/home/personalcenter/suteam' component={SuTeamManage} />
                </Switch>
            </div>
            <div className="menu">
                <Menu
                    style={{ width: 260, height: '100%' }}
                    selectedKeys={key}
                    mode='vertical'
                    theme='light'
                >
                    <Menu.Item key="1" icon={<IdcardOutlined />}>
                        <MyNavLink to='/home/personalcenter/information'>个人信息</MyNavLink>
                    </Menu.Item>
                    <Menu.Item key="5" icon={<UserOutlined /> }>
                        <MyNavLink to='/home/personalcenter/management'>人员管理</MyNavLink>
                    </Menu.Item>
                    <Menu.Item key='7' icon={<TeamOutlined />}>
                    <MyNavLink to='/home/personalcenter/suteam' >管理员端团队管理</MyNavLink>
                    </Menu.Item>
                    {typeofUser === "user" ? <><Menu.Item key="2" icon={<CalendarOutlined />}>
                        <MyNavLink to='/home/personalcenter/personalcontest' >比赛信息</MyNavLink>
                    </Menu.Item>
                    <Menu.Item key='6' icon={<TeamOutlined />}>
                    <MyNavLink to='/home/personalcenter/teammanage' >团队管理</MyNavLink>
                    </Menu.Item>
                    </> : ''}

                    {typeofUser !== "user" ?
                        <>
                            <Menu.Item key="3" icon={<CalendarOutlined />}>
                                <MyNavLink to='/home/personalcenter/competition'>发布比赛</MyNavLink>
                            </Menu.Item>
                            <Menu.Item key="4" icon={<DatabaseOutlined />}>
                                <MyNavLink to='/home/personalcenter/released'>已发布</MyNavLink>
                            </Menu.Item>
                        </> : ''}

                </Menu>
            </div>


        </div>
    );
};

export default PersonalCenter;