import './PersonalCenter.css'
import React, { useEffect, useState } from 'react';
import Info from './Information';
import PersonalContest from './PersonanlContest';
import MyNavLink from '../../components/MyNavLink';
import ReleaseCompetition from './company/ReleaseCompetition';
import Released from './company/Released';
import TeamManage from './student/TeamManage';
import { Menu,message } from 'antd';
import EditableTable from './superManager/Management';
import SuTeamManage from './superManager/SuTeamManage';
import ContestList from './teacher/ContestList';
import RoleManagement from './superManager/RoleManagement';
import url from '../../server/api/url';
import { Route, Switch } from 'react-router-dom';
import store from '../../redux/store';
import new_axios from '../../server/api/axios';

const PersonalCenter = () => {
    const [key,setKey] = useState('1');
    const [menuItem,setMenuItem] = useState([]);
    const typeofUser = store.getState().userInfo.typeofUser;
    useEffect( () => {
        const path=window.location.pathname;
        setKey(path)
    })
    useEffect( () => {
        new_axios({
            method:'GET',
            url:url+`/api/v1/policy/get-menus-by-role?roleId=${localStorage.getItem('userId')}`
        }).then( res => {
            console.log(res)
            if(res.data.code==='200'){
                const item = [];
                if(res.data.data){
                    res.data.data.forEach( element => {
                        item.push(
                            <Menu.Item key={element.path} >
                                <MyNavLink to={element.path}>{element.description}</MyNavLink>
                            </Menu.Item>
                        )
                    });
                    setMenuItem(item);
                }
            }
            else{
                message.error(res.data.msg);
            }
            } )
            .catch( e => {
                console.log(e);
        })
    } ,[])
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
                    <Route path='/home/personalcenter/contestlist' component={ContestList} />
                    <Route path='/home/personalcenter/role' component={RoleManagement} />
                </Switch>
            </div>
            <div className="menu">
                <Menu
                    style={{ width: 260, height: '100%' }}
                    selectedKeys={key}
                    mode='vertical'
                    theme='light'
                >
                    <Menu.Item key="/home/personalcenter/information">
                        <MyNavLink to='/home/personalcenter/information'>个人信息</MyNavLink>
                    </Menu.Item>
                    {menuItem}

                </Menu>
            </div>


        </div>
    );
};

export default PersonalCenter;