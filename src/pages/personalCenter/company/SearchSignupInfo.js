import GoBack from '../../../components/GoBack';
import React from 'react';
import { Button, Table, Spin, Modal, Form,Input,InputNumber, message, Empty, Card, Sapce, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import './SearchSignupInfo.css'
import { useEffect } from 'react';
import url from '../../../server/api/url';
import { useState } from 'react';
import new_axios from '../../../server/api/axios';
import loadFile from '../../../server/api/loadFile';

const SearchSignupInfo = () => {
    const [load, setLoad] = useState(true); 
    const [element,setElement] = useState([]);
    const [type,setType] = useState('single');
    const [visible,setVisible] = useState(false);
    const [visible2,setVisible2] = useState(false);
    const [commentList,setCommentList] = useState([]);
    const [id,setId] = useState(0);
    const [Fform] = Form.useForm();
    const [submit,setSubmit] = useState(false);         //提交评价时禁用按钮
    const [state,setState] = useState(false)

    let contest_id=sessionStorage.getItem('competition_id');
    useEffect(()=>{
        //获取比赛数据
        new_axios({
            method: "GET",
            url:`${url}/api/v1/setting/contest/signup/get-list?contest_id=${sessionStorage.getItem('competition_id')}`,
        }).then(data => {
            if (data.data.code === '200') {
                const data1 = data.data.data;
                console.log(data1)
                if(data1){
                    if( data1[0].target_type === 'team' ){
                    setType('team')
                    }
                }
                
                setElement(data1);
            }
            setLoad(false);//把加载中图标取消掉
        }).catch(e => {
            console.log(e)
        })
    },[state])

    const downloadAll = () => {
        new_axios({
            method:'GET',
            url:url+`/api/v1/setting/contest/download/works?contest_id=${contest_id}`,
            responseType:'blob'
        }).then( res => {
            console.log(res)
            if(res.status === 200){
                var b = new Blob([res.data]);
                // 根据传入的参数b创建一个指向该参数对象的URL
                var url = URL.createObjectURL(b);
                var l = document.createElement('a');
                // 设置导出的文件名
                l.download = `${contest_id}.zip`;
                l.href = url;
                // 点击获取文件
                l.click();
            }
            else {
                message.error('下载失败');
            }
        } ).catch( e => {
            console.log(e)
        } )
    }

    const columns1 = [
        { title: '姓名', dataIndex: ['user','name'], key: 'name' },
        { title: '学号', dataIndex: ['user','account'], key: 'account' },
        { title: '学院', dataIndex: ['user','college'], key: 'college' },
        { title: '邮箱', dataIndex: ['user','email'], key: 'email' },
        { title: <span>作品链接<Button type='link' onClick={downloadAll}>全部下载</Button></span>, 
        width:'15%',
        dataIndex: 'work_link', key:'5',
            render:(text,record) => 
                <div>
                    {
                        !text?
                        <p>未提交作品</p>:
                        <a  onClick={ () => { loadFile(record.work_link) } }>{record.user.name}的作品</a>
                    }
                </div>
        },
        { title: '状态', dataIndex: 'status', key:'7',
            render:text => 
                <div>
                    {
                        text === 'judge'?
                        <span style={{color:"green"}}>已评价</span>:
                        text === 'submit'?
                        <span style={{color:"#1890FF"}}>已提交</span>:
                        <span style={{color:"red"}}>未评价</span>
                    }
                </div>
        },
        { title: '评价作品',key:'7',
            render:(a,b) => <Button disabled={ b.work_link === ''? true : false } onClick={()=>{handleSetView(b.id)}}>评价</Button>},
        ];
        const columns2 = [
            { title: '队名', dataIndex: ['team','name'], key: 'name' },
            { title: '联系方式', dataIndex: ['team','email'], key: 'email' },
            { title: '队长', dataIndex: ['team','leader'], key: 'leader' },
            { title: '作品链接', dataIndex: 'work_link', key:'5',
                render:(text,record) => 
                    <div>
                        {
                            !text?
                            <p>未提交作品</p>:
                            <a  download={record.team.name}>
                            {record.team.name}的作品</a>
                        }
                    </div>
            },
            { title: '状态', dataIndex: 'status', key:'6',
                render:text => 
                    <div>
                        {
                            text === 'judge'?
                            <span style={{color:"lightgreen"}}>已评价</span>:
                            text === 'submit'?
                            <span style={{color:"yellow"}}>已提交</span>:
                            <span style={{color:"red"}}>未评价</span>
                        }
                    </div>
            },
            { title: '评价作品',dataIndex:'id',key:'7',
            render:(a,record) => <Button disabled={ record.work_link === ''? true : false } onClick={()=>{  handleSetView(a,record)} }>评价</Button>
            },
            ];
        
        const handleSetView = (id) =>{
            setVisible(true);
            setId(id)
        }

        const onOK = () => {
            const value = Fform.getFieldsValue(true);
            setSubmit(true);
            new_axios({
                method:'POST',
                url:url+'/api/v1/judge/contest',
                data:{
                    id:id,
                    score:value.score,
                    comment:value.comment
                }
            }).then( data => {
                if(data.data.code === '200'){
                    message.info(data.data.msg);
                    setState(!state);
                }
                else{
                    message.error(data.data.msg)
                }
                setSubmit(false);
                setVisible(false);
            } ).catch( e => {
                console.log(e);
            })
        }

        const spin = (<LoadingOutlined style={{ fontSize: 24 }} spin />);
        
        const allComment = id => {
            setVisible2(true);
            new_axios({
                method:'GET',
                url:url+`/api/v1/judge/contest/logs?signup_id=${id}`
            }).then( res => {
                if(res.data.code === '200'){
                    const data = [];
                    res.data.data.forEach( e => {
                        data.unshift(
                            <Card
                            style={{ marginTop:'10px' }}
                            key={e.id}
                            >
                                <div style={{float:'right'}}>{e.created_at}</div>
                                <p>评分：{e.score}</p>
                                <p>评语：{e.comment?e.comment:'暂无'}</p>
                            </Card>
                        )
                    } )
                    setCommentList(data);
                }
                else{
                    message.error(res.data.msg);
                }
            } ).catch( e => {
                console.log(e);
            } )
        }

        return (
            <div className='signUpTable'>
                <GoBack/>
                <h2>参赛人员列表{type === 'single'?'（单人比赛）':'（团队比赛）'}</h2>
                {
                    load?<Spin indicator={spin} tip='loading' style={{margin:'0 50%'}}/>:

                    <Table 
                    rowKey= { record => record.id } 
                    bordered
                    columns={type === 'single'?columns1:columns2}
                    expandable={{
                    expandedRowRender: record => 
                    <div style={{ margin: 0 }}>
                        <Button type='primary' 
                        onClick={()=>{allComment(record.id)}}
                        style={{ float:'right',borderRadius:'5px' }}>查看全部评价</Button>
                        <p>评分：{record.score}</p>
                        <p>评语：{record.comment?record.comment:''}</p>
                    </div>
                    }}
                    dataSource={element}/>
                }
                
                <Modal 
                width='600px'
                title='评价'
                cancelText={<span>取消</span>}
                okText={<span>提交</span>}
                onOk={onOK}
                confirmLoading={submit}
                onCancel={()=>{setVisible(false)}}
                visible={visible}
                >
                    <Form 
                    labelCol={{span:3}}
                    form={Fform}
                    >
                        <Form.Item
                        name="score"
                        label="分数"
                        rules={[
                            { required: true, message: '请输入得分！' }
                        ]}
                        >
                            <InputNumber min={0} max={100} placeholder='0~100'/>
                        </Form.Item>

                        <Form.Item
                        name="comment"
                        label='评语'
                        >
                            <Input.TextArea/>
                        </Form.Item>

                        <Form.Item
                        name="beizhu"
                        label='注'
                        rules={[
                            { required: true }
                        ]}
                        >
                        <span>第二次评价会修改之前的评价</span>
                        </Form.Item>
                    </Form>
                </Modal> 
                <Modal 
                width='800px'
                title='全部评价'
                footer={null}
                onCancel={()=>{setVisible2(false)}}
                visible={visible2}
                >
                    {commentList.length?
                    commentList :
                    <Empty description='暂无评价'></Empty>}
                </Modal> 
            </div>
            
        )
}

export default SearchSignupInfo;