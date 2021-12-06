import React, { useEffect, useRef, useState } from 'react';
import 'antd/dist/antd.css';
import { Card, Button, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import url from '../../server/api/url';
import axios from 'axios';
import competion_1 from '../../imgs/competition_1.jpg'
// import store from '../../redux/store';

function PersonalContest() {
    const competitionData = useRef();
    const [competitionList, setCompetitionList] = useState([]);
    // const userID = store.getState().userInfo.email;
    const style = {
        'width': '90%',
        'display': 'flex',
        'margin': '0 auto',
        'marginTop': '10px'
    }
    const div_style={
        'position':'relative',
        'left':'100%'
    }
    const props = {

        name: 'file',
        headers: {
          'token':sessionStorage.getItem('token'),
          'X-Requested-With':null
        },
        maxCount:1,
        onChange(info) {
          console.log(info.files)
          if (info.file.status === 'done') {
            message.success(`${info.file.name} 文件上传成功`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 文件上传失败`);
          }
        },
    };
    useEffect(() => {
        axios({
            method: "GET",
            url: `${url}/api/v1/user/own/competition`,
            headers: {
                'token': sessionStorage.getItem('token')
            }
        }).then(data => {
            competitionData.current = data.data.data
            let data1 = []
            console.log(competitionData.current)
            competitionData.current.forEach(e => {
                data1.push(
                    <Card
                        key={e.id}
                        hoverable
                        style={style}
                        cover={<img alt="比赛" src={competion_1} />}
                        className="personalCompetitonList"
                    >
                        <div>
                            <div><p >比赛名称：{e.title}</p></div>
                            <div><p >队长：{e.title}</p></div>
                            <div><p >作品提交截至日期：{e.submit_deadline}</p></div>
                            <div><p >队伍信息：{'null'}</p></div>
                        </div>
                        <div style={div_style}>
                            <Upload {...props}
                            action={`${url}/api/v1/user/competition/post-work?competition_id=${e.id}`}
                            >
                            <Button icon={<UploadOutlined />}>点击上传文件</Button>
                            </Upload>
                            <Button>修改报名信息</Button>
                            <Button>查看比赛成绩</Button>
                        </div>
                    </Card>
                )
            });
            setCompetitionList(data1);
        }).catch(e => {
            console.log(e)
        })
    }, [])
    if (competitionList.length)
        return (
            <div>
                {competitionList}
            </div>

        )
    else
        return (
            <div>暂无报名比赛</div>
        )
}

export default PersonalContest;