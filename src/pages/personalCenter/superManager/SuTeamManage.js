import { Table, Badge, Space, Tag, Modal, Form, Input, message, Button, Select } from 'antd';
import url from '../../../server/api/url';
import React, { useEffect, useState } from 'react';
import new_axios from '../../../server/api/axios';

let teamid;
let status;
let account;
function SuTeamManage() {
    const [teamsData,setTeamsData] = useState([]);
    const [total,setTotal] = useState(0);
    const [visible,setVisible] = useState(false);
    const [form] = Form.useForm();
    const [foundingTeam,setFoundingTeam] = useState([]);
    const [dec,setDec] = useState('');
    const [title,setTitle] = useState('');
    const { Option } = Select;
    useEffect( () => {
        new_axios({
            method:'GET',
            url:url+`/api/v1/setting/team/get-list?limit=10&page=1`
        }).then( res => {
            if( res.data.code === '200' ){
                setTeamsData(res.data.data.data);
                setTotal(res.data.data.total);
            }
        } ).catch( e => {
            console.log(e);
        } )
    } ,[])

    //发送筛选请求
  const searchDetailInfo = (page) => {
    let URL=`${url}/api/v1/setting/team/get-list?limit=10&page=${page}`;
    if(account)     URL+=`&account=${account}`
    if(status)     URL+=`&status=${status}`
    new_axios({
      method:'GET',
      url:URL,
    }).then( data => {
        if(data.data.code === '200' ){
          setTeamsData(data.data.data.data);
          setTotal(data.data.data.total);
        }
    } ).catch( e => {
      if(e.response){
        message.info(e.response.data.msg)
      }
      else{
        message.info('网络错误，获取失败')
      }
    })
  }
    //筛选状态
    const handleChangeStatus = value => {
        if( value !== 'unlimited' ){
            status = value;
        }
        else status = '';
        searchDetailInfo(1);
    }
    //学号查找
    const searchAccount = (value) => {
        console.log(value);
        account=value;
        searchDetailInfo(1);
    }
    //管理员获取队伍信息
    const getTeam = record => {
        form.setFieldsValue({
            teamName:record.name,
            declaration:record.declaration
        })
        console.log(record)
        setVisible(true);
        setTitle(record.name);
        teamid = record.id;
        setDec(record.declaration);
        setFoundingTeam(record.members);
    }

    //提交表单数据
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
                }
                else{
                    message.error(res.data.msg)
                }
                setVisible(false)
            } ).catch( e =>{
                console.log(e);
                if(e.response){
                    message.error(e.response.data.msg)
                }
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

    //内置表单  
    const expandedRowRender = (record) => {
        console.log(record);
        const columns = [
        { title: '姓名', dataIndex: 'name', key: 'personalName' },
        { title: '学号', dataIndex: 'account', key: 'account' },
        { title: '邮箱', dataIndex: 'email', key: 'personalEmail' },
        {
            title: '状态',
            dataIndex:'acked',
            key: 'status',
            render: item => (
            <span>
                {
                    item === 'yes' ?
                    <span><Badge status="success" />同意</span>:
                    <span><Badge status="warning" />等待</span>
                }
            </span>
            ),
        },
        ];
        return <Table columns={columns} bordered dataSource={record.members} pagination={false} rowKey={ record=>record.id } />;
    };

    const columns = [
        { title: '队名', dataIndex: 'name', key: 'name' },
        { title: '状态', dataIndex: 'status', key: 'status', 
        render:item => { 
            return(
                    item === 'valid' ?
                    <Tag color='green'>已创建</Tag> :
                    <Tag color='yellow'>创建中</Tag>
            )
            
        }},
        { title: '联系方式', dataIndex: 'email', key: 'email' },
        { title: '队长', dataIndex: 'leader', key: 'leader' },
        { title: '人数', dataIndex: 'number', key: 'number' },
        { title: '已同意人数', dataIndex: 'ack_number', key: 'ack_number' },
        { title: '操作', key: 'operation', 
        render: (record) => 
        <Button type='link' disabled={ record.status === 'valid' ? true : false } onClick={ () => { getTeam(record) } }>修改</Button> },
    ];

    return (
        <div>
            <h2>团队列表</h2>
            <p style={{ color:'red' }}>团队为学生私人信息，通常作管理员浏览用，请勿随意修改，修改前请通知用户（已创建的团队不允许修改）</p>
            <span>筛选条件：  </span>
            <Select size='large' style={{ width: 120,marginRight:'30px' }} onChange={handleChangeStatus} placeholder='状态'>
                <Option value="unlimited">不限</Option>
                <Option value="valid">已创建</Option>
                <Option value="invalid">创建中</Option>
            </Select>
            <Input.Search 
            size='large' 
            style={{width:'350px',marginRight:'30px'}} 
            placeholder='队长学号'
            onSearch={searchAccount}
            />
            <Table
            className="components-table-demo-nested"
            rowKey={ record => record.id } 
            columns={columns}
            bordered
            expandable={{ expandedRowRender }}
            dataSource={teamsData}
            pagination={
                {
                    total:total
                }
            }
            />
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
                    <Form.Item
                    name='teamName'
                    rules={[
                        { required:true,message:'缺少队伍名' }
                    ]}>
                        <Input/>
                    </Form.Item>
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
                                        <span>队员{item.id}</span>
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
                                            <Input placeholder="学号" />
                                        </Form.Item>
                                        <Form.Item
                                        initialValue={item.name}
                                        name={[`name`,item.id]}
                                        rules={[{ required: true, message: '缺少姓名' }]}
                                        >
                                            <Input placeholder="姓名" />
                                        </Form.Item>
                                        <Form.Item
                                        name={[`email`,item.id]}
                                        initialValue={item.email}
                                        rules={[{ required: true, message: '缺少邮箱',type:'email' }]}
                                        >
                                            <Input placeholder="邮箱" />
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

export default SuTeamManage;