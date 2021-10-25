import './PersonalCenter.css'
import Info from './Information';
import Contest from './Contest';
import MyNavLink from '../../components/MyNavLink'
import { Menu } from 'antd';
import {
  IdcardOutlined,
  CalendarOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import {Route,Switch} from 'react-router-dom';

const PersonalCenter = () => {

  return (
    <div className="father">
        <div className="info">
            <Switch>
                <Route path='/personalcenter/information' component={Info}/>
                <Route path='/personalcenter/contest' component={Contest} />
            </Switch>
        </div>
        <div className="menu">
            <Menu
            style={{ width: 260,height:'100%' }}
            defaultOpenKeys={['sub1']}
            mode='vertical'
            theme='light'
            >
            <Menu.Item key="1" icon={<IdcardOutlined />}>
                <MyNavLink to='/personalcenter/information'>个人信息</MyNavLink>
            </Menu.Item>
            <Menu.Item key="2" icon={<CalendarOutlined />}>
                <MyNavLink to='/personalcenter/contest'>比赛信息</MyNavLink>
            </Menu.Item>
            <Menu.Item key="3" icon={<CalendarOutlined />}>
                另一个
            </Menu.Item>
            <Menu.Item key="link" icon={<LinkOutlined />}>
            <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
                Ant Design
            </a>
            </Menu.Item>
        </Menu>
        </div>
        
      
    </div>
  );
};

export default PersonalCenter;