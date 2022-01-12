import React, { useEffect } from 'react';
import { Menu } from 'antd';
import MyNavLink from '../../../components/MyNavLink';
import { Route, Switch, useHistory } from 'react-router-dom';
import MyTeam from './Myteam';
import TeamNews from './TeamNews';
const TeamManage = () => {
    const history = useHistory();

    useEffect( () => {
        history.push('/home/personalcenter/teammanage/myteam');
    } ,[])

    return (
        <div>
            <Menu
            mode='horizontal'
            defaultSelectedKeys={['myteam']}
            style={{ textAlign:'center' }}>
                <Menu.Item key='myteam' style={{width:'45%'}}>
                    <MyNavLink to='/home/personalcenter/teammanage/myteam' >我的团队</MyNavLink>
                </Menu.Item>
                <Menu.Item key='teamnews' style={{width:'45%'}}>
                    <MyNavLink to='/home/personalcenter/teammanage/teamnews' >创建中</MyNavLink>
                </Menu.Item>
            </Menu>
            <Switch>
                <Route path='/home/personalcenter/teammanage/myteam' component={MyTeam}></Route>
                <Route path='/home/personalcenter/teammanage/teamnews' component={TeamNews}></Route>
            </Switch>
        </div>
        
    )
}

export default TeamManage;