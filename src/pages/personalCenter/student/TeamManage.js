import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import MyTeam from './Myteam';
import TeamNews from './TeamNews';
const TeamManage = () => {
    const { TabPane } = Tabs;
    return (
        <div>
            <Tabs defaultActiveKey="1" centered tabBarGutter={ 300 }>
                <TabPane tab="我的团队" key="1">
                    <MyTeam/>
                </TabPane>
                <TabPane tab="创建中" key="2">
                    <TeamNews/>
                </TabPane>
            </Tabs>
        </div>
        
    )
}

export default TeamManage;