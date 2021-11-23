import './PersonalCenter.css'
import Info from './Information';
import Contest from './Contest';
import MyNavLink from '../../components/MyNavLink';
import ReleaseCompetition from './ReleaseCompetition';
import Released from './Released';
import { Menu } from 'antd';
import {
    IdcardOutlined,
    CalendarOutlined,
    DatabaseOutlined
} from '@ant-design/icons';
import { Route, Switch } from 'react-router-dom';
import store from '../../redux/store';

const PersonalCenter = () => {
    const typeofUser = store.getState().typeofUser
    // console.log(ifManager)
    return (
        <div className="father">
            <div className="info">
                <>占位，不然显示不出来，待解决</>
                <Switch>
                    <Route path='/home/personalcenter/information' component={Info} />
                    <Route path='/home/personalcenter/contest' component={Contest} />
                    <Route path='/home/personalcenter/competition' component={ReleaseCompetition} />
                    <Route path='/home/personalcenter/released' component={Released} />
                </Switch>
            </div>
            <div className="menu">
                <Menu
                    style={{ width: 260, height: '100%' }}
                    defaultOpenKeys={['sub1']}
                    mode='vertical'
                    theme='light'
                >
                    <Menu.Item key="1" icon={<IdcardOutlined />}>
                        <MyNavLink to='/home/personalcenter/information'>个人信息</MyNavLink>
                    </Menu.Item>
                    {typeofUser == "user" ? <><Menu.Item key="2" icon={<CalendarOutlined />}>
                        <MyNavLink to='/home/personalcenter/contest'>比赛信息</MyNavLink>
                    </Menu.Item></> : ''}

                    {typeofUser !== "user" ?
                        <>
                            <Menu.Item key="3" icon={<CalendarOutlined />}>
                                <MyNavLink to='/home/personalcenter/competition'>发布比赛</MyNavLink>
                            </Menu.Item>
                            <Menu.Item key="4" icon={<CalendarOutlined />}>
                                <MyNavLink to='/home/personalcenter/released'>已发布</MyNavLink>
                            </Menu.Item>
                        </> : ''}

                </Menu>
            </div>


        </div>
    );
};

export default PersonalCenter;