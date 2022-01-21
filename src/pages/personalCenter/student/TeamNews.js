import { Card, Space, Empty, Button, message, Modal, Form, Input, Tag, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from "react";
import new_axios from "../../../server/api/axios";
import url from "../../../server/api/url";

const MyTeamStyle = {
    margin:'0 auto',
    width:'80%'
}

const myAccount=sessionStorage.getItem('account');
let teamid

function TeamNews() {
    const [form] = Form.useForm();
    const [loading,setLoading] = useState(true);
    const [teams,setTeams] = useState([]);
    const [dec,setDec] = useState('');
    const [visible,setVisible] = useState(false);
    const [title,setTitle] = useState('');
    const [foundingTeam,setFoundingTeam] = useState([]);

    //获取有关于自己的队伍的全部信息
    useEffect( () => {
        new_axios({
            method:'GET',
            url:url+'/api/v1/team/join',
        }).then( data => {
            if( data.data.code === '200' ) {
                setLoading(false);
                const allTeams=data.data.data;
                if(allTeams !== null){
                    const every = [];
                    allTeams.map( item => {
                        const detail = item.team;
                        //invalid表示队伍还在创建的过程中，加入创建中的数组
                        if( item.team.status === 'invalid' ){
                            every.unshift(
                                <Card
                                title={ detail.name }
                                style={{marginBottom:'10px'}} 
                                hoverable
                                key={item.team_id}
                                extra={
                                    sessionStorage.getItem('account') === detail.leader ? 
                                    <Button type="primary" onClick={ () => { getTeam(item.team_id) } }>修改队伍信息</Button> :
                                    item.acked === 'yes' ? 
                                    <Button type="primary" disabled>已同意</Button> :
                                    <Button type="primary" onClick={() => { agree(item.team_id) }}>加入队伍</Button>
                                }   
                                >
                                    <Space>
                                        <h4>队长：{ detail.leader }</h4>
                                        <h4>联系方式：{ detail.email }</h4>
                                        
                                    </Space><br/>
                                    <Space>
                                        <h4>总人数：{ detail.number }</h4>
                                        <h4>已同意人数：{ detail.ack_number }</h4>
                                    </Space><br/>
                                    
                                    <h4>宣言：{ detail.declaration }</h4>
                                </Card>
                            )
                        }
                    } )
                    setTeams(every); 
                }
            }
        } )
    },[] )

    //队长获取队伍信息
    const getTeam = id => {
        teamid = id;
        new_axios({
            method:"GET",
            url:url+`/api/v1/team/own/${id}`
        }).then( res => {
            console.log(res);
            if( res.data.code === '200' ){
                setVisible(true);
                setTitle(res.data.data.name);
                setFoundingTeam(res.data.data.members);
                setDec(res.data.data.declaration)
                form.setFieldsValue({
                    teamName:res.data.data.name,
                    declaration:res.data.data.declaration
                })
            }
        }).catch( e => {
            console.log(e);
        } )
    }

    const onFinish = values => {
        console.log(values)
        const account = values.users.account;
        const email = values.users.email;
        const name = values.users.name;
        const change = [];
        let flag = false;
        if(values.teamName === title){
            flag = true;
        }
        if(values.declaration === dec){
            flag = true;
        }
        console.log(values.teamName === title)
        for(let i=0;i<foundingTeam.length;i++){
            if(account[i+1] !== foundingTeam[i].account || email[i+1] !== foundingTeam[i].email || name[i+1] !== foundingTeam[i].name){
                change.push({
                    id:i+1,
                    account:account[i+1],
                    name:name[i+1],
                    email:email[i+1]
                })
                flag = true;
            }
            console.log(i+1);
        }
        console.log(change);
        if(flag){
            new_axios({
                method:"PUT",
                url:url+`/api/v1/team/${ teamid }`,
                data:{
                    name:values.teamName ,
                    declaration:values.declaration,
                    members: change.length > 0 ? change :undefined
                }
            }).then( res => {
                console.log(res);
                if(res.data.code === '200'){
                    message.info('修改成功')
                    setVisible(false)
                }
            } ).catch( e =>{
                console.log(e);
            } )
        }
        else{
            message.warning('未修改数据')
        }
    }
    //队长修改队员信息
    const manage = () => {
        form.submit();
        
    }

    //队员同意加入队伍
    const agree = teamId => {
        new_axios({
            method:'POST',
            url:url+`/api/v1/team/ack/${teamId}`,
        }).then( data => {
            if( data.data.code === '200' ) {
                message.info('加入成功');
                setTimeout( () =>{ window.location.reload() }, 300 );
            }
            else{
                message.error(data.data.msg);
            }
        } ).catch( e => {
            message.error(e.response.data.msg?e.response.data.msg:'网络错误');
        } )
    }

    return ( 
        <div style={ MyTeamStyle }>
            {
                loading ? <Spin indicator={ <LoadingOutlined /> } size='large' tip='加载中' style={{ marginLeft:'50%' } }></Spin> :
                teams.length === 0 ? <Empty description='暂无创建中的团队' /> :  teams
            }
            <Modal 
            title={title}
            visible={visible}
            okText='提交'
            cancelText='取消'
            width='620px'
            onOk={manage}
            onCancel={ () => { setVisible(false) } }
            >
                <Form 
                autoComplete="off" 
                form={form} 
                onFinish={onFinish}
                >
                    <p>队名：</p>
                    <Form.Item
                    name='teamName'
                    rules={[
                        { required:true,message:'缺少队伍名' }
                    ]}>
                        <Input/>
                    </Form.Item>
                    <p>宣言：</p>
                    <Form.Item
                    name='declaration'
                    rules={[
                        { required:true,message:'缺少宣言' }
                    ]}>
                        <Input/>
                    </Form.Item>
                    <Form.List name="users"
                    >
                        {() => (
                        <>
                            {foundingTeam.map(item => (
                                <div>
                                    <Space>
                                        <span>队员{item.name}</span>
                                        <span>状态：</span>
                                        { 
                                            item.acked === 'yes' ?
                                            <Tag color='green'>agree</Tag> :
                                            <Tag color='yellow'>watting</Tag> 
                                        }
                                    </Space>
                                    <Space key={item.account}  align="baseline">
                                        <Form.Item
                                        initialValue={item.account}
                                        name={[`account`,item.id]}
                                        rules={[{ required: true, message: '缺少学号' }]}
                                        >
                                            <Input placeholder="学号" disabled={ item.account=== myAccount?true:false }/>
                                        </Form.Item>
                                        <Form.Item
                                        initialValue={item.name}
                                        name={[`name`,item.id]}
                                        rules={[{ required: true, message: '缺少姓名' }]}
                                        >
                                            <Input placeholder="姓名" disabled={ item.account=== myAccount?true:false }/>
                                        </Form.Item>
                                        <Form.Item
                                        name={[`email`,item.id]}
                                        initialValue={item.email}
                                        rules={[{ required: true, message: '缺少邮箱',type:'email' }]}
                                        >
                                            <Input placeholder="邮箱" disabled={ item.account=== myAccount?true:false }/>
                                        </Form.Item>
                                    </Space>
                                </div>
                            ))}
                        </>
                        )}
                    </Form.List>
                </Form>

            </Modal>
        </div>
        
    );
}

export default TeamNews;