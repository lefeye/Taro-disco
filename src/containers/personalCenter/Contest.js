import React, { useEffect, useRef, useState } from 'react';
import 'antd/dist/antd.css';
import { Card } from 'antd';
import url from './../../server/api/url';
import axios from 'axios';
import competion_1 from '../../imgs/competition_1.jpg'
import store from '../../redux/store';

function Contest() {
    const competitionData = useRef();
    let [competitionList,setComp]=useState([]);
    const userID = store.getState().userInfo.email;
    const style = {
        'width': '90%',
        'display': 'flex',
        'margin': '0 auto',
        'margin-top': '10px'
    }
    useEffect(() => {
        axios({
            method: "GET",
            url: `${url}/api/v1/user/own/competition`,
            headers: {
                'token': localStorage.getItem('token')
            }
        }).then(data => {
            // setCompetionData(data.data.data)
            competitionData.current = data.data.data
            // competitionList = []
            let data1=[]
            console.log(competitionData.current)
            competitionData.current.forEach(e => {
                data1.push(<Card
                    key={e.id}
                    hoverable
                    style={style}
                    cover={<img alt="example" src={competion_1} />}
                >
                    <div>
                    <div><p >比赛名称：{e.title}</p></div>
                    <div><p >作品提交截至日期：{e.submit_deadline}</p></div>
                    <div><p >队伍信息：{'null'}</p></div>
                </div>
                </Card>)
            });
            setComp(data1);
        }).catch(e => {
            console.log(e)
        })
    }, [])
    return (
        <div>
            {/* {competitionData.current ? <> {competitionList}</>
                : ''(<p>无记录</p>)} */}
            <Card
                hoverable
                style={style}
                cover={<img alt="example" src={competion_1} />}
            >
                <div>
                    <div><p >比赛名称：</p></div>
                    <div><p >作品提交截至日期：</p></div>
                    <div><p >队伍信息：</p></div>
                </div>
            </Card>
            {/* <p>lalala</p> */}
            {competitionList}
        </div>
    )
}

export default Contest;