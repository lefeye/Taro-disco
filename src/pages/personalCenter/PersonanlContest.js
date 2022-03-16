import React, { useEffect, useRef, useState, } from 'react';
import 'antd/dist/antd.css';
import { Card, Button, Upload, message } from 'antd';
import url from '../../server/api/url';
import new_axios from '../../server/api/axios';
import { useHistory } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
// import store from '../../redux/store';

function PersonalContest() {
    const competitionData = useRef();
    const [competitionList, setCompetitionList] = useState([]);
    const history = useHistory();
    const [ss,setSs] = useState(false);
    // const userID = store.getState().userInfo.email;
    const style = {
        'width': '80%',
        'margin': '0 auto',
        'marginTop': '10px'
    }

    //文件的参数
    const props = {

        name: 'file',
        headers: {
          'X-Requested-With':null,
          Authorization:'Bearer '+sessionStorage.getItem('token'),
        },
        maxCount:1,
        onChange(info) {
          if (info.file.status === 'done') {
              if(info.file.response){
                if(info.file.response.code==='200'){
                    message.success(`${info.file.name} 文件上传成功`);
                }
                else{
                    message.error(info.file.response.msg)
                }
              }
            else{
                message.error(`${info.file.name} 文件上传失败`);
            }
            setSs(!ss);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 文件上传失败`);
          }
        },
    };

    //下载文件
    const loadFile = link => {
        new_axios({
            method:'GET',
            url:url+`/api/v1/contest/download?url=${link}`
        })
    }

    useEffect(() => {
        new_axios({
            method: "GET",
            url: `${url}/api/v1/contest/single/get-list`,
        }).then(data => {
            competitionData.current = data.data.data
            let data1 = []
            competitionData.current.forEach(e => {
                data1.push(
                    <Card
                        key={e.id}
                        style={style}
                    >
                        <div style={{ float:'left' }}>
                        <p>比赛题目：
                            <Button type='link'
                            onClick={ () =>{ history.push('/home/detail'); sessionStorage.setItem('compId', `${e.contest.id}`) } }>
                            {e.contest.title}
                            </Button>
                            <span>作品链接：{e.work_link?
                            <a  onClick={ () => { loadFile(e.work_link) } }>点击下载</a>:
                            `暂未提交作品，请在${e.contest.begin_submit}至${e.contest.end_submit}间提交`}</span>
                            </p>
                            <p>评分：{e.score}</p>
                            <p>评语：{e.comment?e.comment:'暂无评语'}</p>
                        </div>
                        <div style={{ float:'right' }}>

                        <div>
                            <Upload {...props}
                            action={`${url}/api/v1/contest/submit?signup_id=${e.id}`}
                            >
                            <Button icon={<UploadOutlined />}>点击上传文件</Button>
                            </Upload>
                        </div>
                            
                        </div>
                    </Card>
                )
            });
            setCompetitionList(data1);
        }).catch(e => {
            console.log(e)
        })
    }, [ss])
    if (competitionList.length)
        return (
            <div>
                <h2>比赛列表</h2>
                <p>该版仅可查看个人比赛，团队比赛请到“团队管理-我的团队-查看团队参赛情况”中查看</p>
                {competitionList}
            </div>

        )
    else
        return (
            <div>暂无报名比赛</div>
        )
}

export default PersonalContest;