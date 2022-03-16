import React, { useEffect, useState } from 'react'
import {
    Modal,
    Button,
    message,
    Select,
    Space,
} from 'antd'
// import { useHistory } from 'react-router-dom'
import './DetailInfo.css';
import GoBack from '../GoBack';
import new_axios from '../../server/api/axios';
import url from '../../server/api/url';

let teamID;

export default function DetailInfo() {
    // const history = useHistory();
    // const [publishTime, setPublishTime] = useState("")
    const [team,setTeam] = useState([]);
    const [visible, setVisible] = React.useState(false);
    // const [confirmLoading, setConfirmLoading] = React.useState(false);
    // const [form] = Form.useForm();
    const [data, setData] = useState({});
    const compId = sessionStorage.getItem('compId');
    const [ifparticipate, setIfparticipate] = React.useState(false);
    const { Option } = Select;

    useEffect(() => {
        new_axios({
            method: "GET",
            url: `${url}/api/v1/contest/${compId}`,
        }).then(data => {
            if (data.data.code === '200') {
                const data1 = data.data.data;
                console.log(data1);
                setData(data1);
            }
            else{
                message.error(data.data.msg)
            }
        }).catch(e => {
            console.log(e)
        })
    }, [])

    useEffect(() => {
        // new_axios({
        //     method: "GET",
        //     url: `${url}/api/v1/user/own/competition`,
        //     headers: {
        //         'token': sessionStorage.getItem('token')
        //     }
        // }).then(data => {
        //     console.log(data.data.data)
        //     data.data.data.forEach(element => {
        //         if (element["id"] === compId) {
        //             setIfparticipate(true);
        //         }
        //     });
        // })
        new_axios({
            method:'GET',
            url:url+'/api/v1/team/own/get-list',
        }).then( data => {
            console.log(data);
            if(data.data.code === '200'){
                setTeam(data.data.data);
            }
        } ).catch( e =>{
            console.log(e)
        } )
    }, [])

    const showModal = () => {
        if (sessionStorage.getItem('token')){
            setVisible(true);
        }
            
        else {
            message.info('请先登录！');
        }
    };

    const handleOk = () => {
        // if (teamMember.length) {
        //     onFinish(teamMember);
        //     setConfirmLoading(true);
        //     setTimeout(() => {
        //         setVisible(false);
        //         setConfirmLoading(false);
        //     }, 2000);
        // }
            new_axios({
                method:'POST',
                url:url+'/api/v1/contest/signup',
                data:{
                    contest_id:parseInt(compId),
                    target_id:data.attribute === 'team'? teamID : 0,
                    target_type:data.attribute === 'team'? 'team' :'single'
                }
            }).then( data => {
                if(data.data.code === '200'){
                    message.info(data.data.msg);
                    setVisible(false);
                }
                else message.error(data.data.msg);
            } )

    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setVisible(false);
    };

    const handleTeamChange = value => {
        console.log(value);
        teamID=value;
    }
    const option = (
        <Select  onChange={handleTeamChange} placeholder='选择队伍' style={{ width:'300px' }}>
            {
                team.map( item => 
                    <Option value={item.id} ><Space>{item.name}人数：{item.number}</Space></Option>
             )
            }
        </Select>
    )
    const pp =(
        <div>
            <p>团队参赛{data.min_num === 1?'（可单人参加）':''}</p>
            <span>参赛人数：{data.min_num}~{data.max_num}人</span>
        </div>
        
    )
    return (
        <div>
            <GoBack/>
            <h3 class="content-title">{data.title}</h3>
            <h4 class="content-date">主办方：{data.sponsor}</h4>
            <h4 class="content-date">发布时间：{data.created_at}</h4>
            <hr></hr>
            <p className="content-body">
                <span>比赛简介</span>
                <br />
                {data.brief}
                <br />
                <span>参赛要求</span>
                <br />
                {data.condition}
                <br />
                <span>赛制</span>
                <br />
                {data.attribute === 'single'?'单人参赛':pp }
                <br /><span>奖励</span>
                <br />
                {data.award}
                <br /><span>报名起止时间</span>
                <br />
                {data.begin_signup} 至 { data.end_signup }
                <br /><span>比赛起止时间</span>
                <br />
                {data.begin_submit} 至 { data.end_submit }
            </p>
            {ifparticipate ?
                <Button type="primary" disabled
                    style={{
                        display: 'block', margin: 'auto',
                        textAlign: 'center'
                    }}>
                    (您已报名)
                </Button> : <>

                    <div style={{ textAlign: 'center' , marginBottom:'20px'}}>
                        <Button type="primary" onClick={showModal} >
                            立即报名
                        </Button>
                    </div>
                    <Modal
                        title="报名确认"
                        visible={visible}
                        onOk={handleOk}
                        // confirmLoading={confirmLoading}
                        onCancel={handleCancel}
                    >
                        { data.attribute==='team'?option:'请确认是否报名' }
                    </Modal></>
            }
        </div >
    )
}