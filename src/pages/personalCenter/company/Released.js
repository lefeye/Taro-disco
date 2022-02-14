import {
    Card, Col, Row,
    Button, message,
    Spin, Empty, Drawer,
    Form, Input,Modal,
    DatePicker,
    Pagination,
    Select,InputNumber, Space, Tag
} from "antd";
import 'moment/locale/zh-cn';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import { LoadingOutlined } from '@ant-design/icons';
import new_axios from "../../../server/api/axios";
import React, { useEffect, useState } from "react";
import './Released.css'
import url from "../../../server/api/url";
import moment from "moment";
import { useHistory } from "react-router-dom";
import '../../../server/api/dateChange'

let mi;
let ma;
const Released = () => {
    const [load, setLoad] = useState(true);                            //加载中
    const [element, setElement] = useState([]);                        //展开成react对象后的数组
    const [visible, setVisible] = useState(false);                     //抽屉可视化
    const [form] = Form.useForm();                                     //表单对象
    const [currentId, setCurrentId] = useState(10000);                 //当前选中的比赛ID
    const history = useHistory();                                      //路由操作 
    const [min,setMIn] = useState(0);
    const [max,setMax] = useState(6);
    const [isteam,setIsTeam] = useState(false);                        //是否是团队赛制
    const [mmin,setMmin] = useState(0);
    const [mmax,setMmax] = useState(0);
    const [teachers,setTeachers] = useState([]);                       //存放所有教师的信息
    const [judges,setJudges] = useState([]);                           //存放所有评委的信息
    const [modalVisible,setModalVisible] = useState(false);            //Modal可视
    const { RangePicker } = DatePicker;
    const { Option } = Select;
    const [state,setState] = useState(false);
    const [id,setId] = useState(0);
    message.config({
        maxCount: 1
    })

    let cptJudges = [];                                              //存放选择的评委                                                  //添加评委的比赛的id 
    //获取教师列表
    useEffect( () => {
        new_axios({
            method:"GET",
            url:url+'/api/v1/setting/user/get-list?identity=teacher'
        }).then( res => {
            console.log(res);
            if( res.data.code === '200' ){
                setTeachers(res.data.data.data);
            }
            else{
                message.error('教师信息获取失败');
            }
        } ).catch( e => {
            console.log(e);
        } )
    } , [state] )

    useEffect(() => {
        //获取比赛数据
        new_axios({
            method: "GET",
            url: `${url}/api/v1/setting/contest/get-list`,
        }).then(data => {
            if (data.data.code === '200') {
                const data1 = data.data.data.data;
                const data3 = [];
                for (const item of data1) {
                    data3.unshift(
                        <Col span={8} key={item.id}>
                            <Card
                                title={item.title}
                                className='card'
                                extra={<Button type='link' onClick={() => { viS(item) }}>详情</Button>}
                            >
                                <p>主办方:{item.sponsor}</p>
                                <p>发布时间：{item.created_at}</p>
                                <p>上次修改时间：{item.updated_at}</p>
                                <p>参赛要求：{item.condition}</p>
                                <p>赛制：{item.attribute === 'single' ? '单人' : '组队' }</p>
                                <p style={ { fontWeight:'bold' } }>更多信息请在右上角比赛详情页面查看</p>
                                <Space>
                                    <Button onClick={() => { searchSignupInfo(item) }}>查看报名情况</Button>
                                    <Button onClick={ ()=>{selectJudges(item.id)} }>添加评委</Button>
                                </Space>
                                
                            </Card>
                        </Col>
                    )
                }
                setLoad(false);//把加载中图标取消掉
                setElement(data3);
            }
            else if (data.data.status === -1) {
                message.error('登录授权过期，请重新登录！');
                history.push('/login');
            }
        }).catch(e => {
            console.log(e)
        })
    }, [state])

    //选择评委&保存比赛的id
    const sendMessage = id => {
        new_axios({
            method:'GET',
            url:url+`/api/v1/setting/judge/get?contest_id=${id}`
        }).then( res => {
            console.log(res)
            if( res.data.code === '200' ){
                setJudges(res.data.data)
            }
            else{
                message.error(res.data.msg);
            }
        } ).catch( e => {
            console.log(e);
        } )
    }
    const selectJudges = id => {
        sendMessage(id)
        setModalVisible(true);
        setId(id)
    }

    //点击按钮展开比赛信息
    const viS = item => {
        setVisible(true)
        console.log(item);
        setCurrentId(item.id);
        if(item.attribute === 'team'){
            setIsTeam(true);
        }
        setMmax(item.max_num);
        setMmin(item.min_num)
        form.setFieldsValue({
            title: item.title,
            brief: item.brief,
            entry_requirement: item.condition,
            award: item.award,
            attribute:item.attribute,
            signup_deadline: [moment(item.begin_signup),moment(item.end_signup)],
            submit_deadline: [moment(item.begin_submit),moment(item.end_submit)],
            min:item.min_num,
            max:item.max_num
        })
    }

    //跳转到参赛人员列表
    const searchSignupInfo = item => {
        sessionStorage.setItem('competition_id', `${item.id}`);
        history.push('/home/searchsignupinfo');
    }

    //改变参赛人数
    const attributeChange = value => {
        if( value === 'team' ){
            setIsTeam(true);
        }
        else {
            setIsTeam(false);
        }
    }
    //修改比赛
    const handleSubmit = () => {
        const values = form.getFieldsValue(true);
        console.log(values);
        let firstTime = values.signup_deadline[1]._d.Format("yyyy-MM-dd hh:mm:ss");
        let secondTime = values.submit_deadline[0]._d.Format("yyyy-MM-dd hh:mm:ss");
        if (firstTime > secondTime) {
            message.error('比赛开始时间早于报名截止时间，请检查时间设定！');
        }
        else {
            new_axios({
                method: "PUT",
                url: `${url}/api/v1/setting/contest/${currentId}`,
                data: {
                    title: values.title,
                    brief: values.brief,
                    award: values.award,
                    attribute:values.attribute,
                    min_num:isteam ? mi: null,
                    max_num:isteam ? ma: null,
                    condition: values.entry_requirement,
                    begin_signup:values.signup_deadline[0]._d.Format("yyyy-MM-dd hh:mm:ss"),
                    end_signup:firstTime,
                    begin_submit: secondTime,
                    end_submit: values.submit_deadline[1]._d.Format("yyyy-MM-dd hh:mm:ss"),
                    
                },
            }).then(data => {
                if (data.data.code === '200') {
                    message.info('更新比赛成功！');
                    setVisible(false);
                }
                else {
                    message.error(data.data.msg);
                }
                setState(!state);
            }).catch(e => {
                console.log(e);
                message.error("网络错误");
            })
        }
    }
    const handlePageChange = value => {
        setMIn((value-1)*6);
        setMax(value*6);
    }

    const changeMin = value => {
        mi = value;
    }
    const changeMax = value => {
        ma = value;
    }
    const numbers = (
        <div>
            <Form.Item
            label='人数'
            name='min'>
                <InputNumber min={1} max={10} value={ mmin } onChange={ changeMin }></InputNumber>~
                <Form.Item
                name='max'
                noStyle>
                    <InputNumber min={1} max={10} value={ mmax } onChange={ changeMax }></InputNumber>人（最多10人）
                </Form.Item>
            </Form.Item>
            
        </div>
        
    )

    //选择评委
    const handleJudgesChange = value => {
        cptJudges=value;
    }
    
    //隐藏Modal
    const handleCancel = () =>{
        setModalVisible(false);
        
    }

    //提交Modal的数据
    const handleOk = () => {
        new_axios({
            method:'POST',
            url:url+'/api/v1/setting/judge/add',
            data:{
                
                judges:cptJudges,
                contest_id:id
            }
        }).then( res => {
            console.log(res)
            if( res.data.code === '200' ){
                message.info(res.data.msg);
                sendMessage(id);
            }
            else{
                message.error(res.data.msg)
            }
        } ).catch( e => {
            console.log(e);
        } )
    }
    const options = (
        <Select mode="multiple" onChange={handleJudgesChange} placeholder='添加评委' style={{ width:'300px' }}>
            {
                teachers.map( item => 
                    <Option value={item.id} key={item.id}>
                        <Space size='large' >
                            {item.name}
                            {item.enable===true?<></>:<Tag color={'red'}>帐号被禁用</Tag>}
                        </Space>
                    </Option>
             )
            }
        </Select>
    )
    const judgeView = (
        <Space>
            <span>已有评委：</span>
            { judges?
            judges.map( item =>
                <Tag key={item.id}style={{fontSize:'14px',fontWeight:'bold' }}>{item.name}</Tag>
            ):'暂无评委' }
        </Space>
    )

    const spin = (<LoadingOutlined style={{ fontSize: 24 }} spin />);

    return (
        <div style={{ margin: "2%" }}>
            <Row gutter={[16, 16]}>
                {load === true ?
                    <Spin indicator={spin} tip='loading' style={{ margin: '0 auto' }} />
                    : element.length > 0 ?
                        element.slice(min,max)
                        
                        : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无数据' />}
                <Pagination  style={{marginLeft:'80%'}} defaultCurrent={1} total={element.length} pageSize={6} hideOnSinglePage onChange={handlePageChange}/>
            </Row>
            <Drawer
            title="查看/修改比赛数据"
            width={720}
            visible={visible}
            onClose={() => { setVisible(false) }}
            bodyStyle={{ paddingBottom: 80 }}
            extra={
                <Form.Item>
                    <Button type="primary" onClick={handleSubmit}>
                        修改
                    </Button>
                </Form.Item>

            }

            >
                <Form layout="vertical" hideRequiredMark
                form={form}
                onFinish={handleSubmit}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                            name="title"
                            label="比赛标题"
                            rules={[{ required: true, message: '标题不能为空' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                            name="brief"
                            label="简介"
                            rules={[
                                {
                                    required: true,
                                    message: '比赛描述不能为空',
                                },
                            ]}
                            >
                                <Input.TextArea rows={3} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                            name="entry_requirement"
                            label="参赛条件"
                            rules={[
                                {
                                    required: true,
                                    message: '参赛条件不能为空',
                                },
                            ]}
                            >
                                <Input.TextArea rows={2} placeholder='例如：参赛队员不能少于3人或多于5人' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                            name="attribute"
                            label="参赛形式"
                            rules={[
                                {
                                    required: true,
                                    message: '作品要求不能为空',
                                },
                            ]}
                            >
                                <Select onChange={ attributeChange } placeholder='单人或组队' >
                                    <Option value="single">单人</Option>
                                    <Option value="team">组队</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            {
                                isteam ? numbers : <></>
                            }
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                            name="award"
                            label="比赛奖励"
                            rules={[
                                {
                                    required: true,
                                    message: '比赛奖励不能为空',
                                },
                            ]}
                            >
                                <Input.TextArea rows={2} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                            name="signup_deadline"
                            label="报名起止时间"
                            rules={[{ required: true, message: '报名截止时间不能为空' }]}
                            >
                                <RangePicker
                                    style={{ width: '100%' }}
                                    format="YYYY-MM-DD HH:mm"
                                    showTime={{ format: 'HH:mm' }}
                                    locale={locale}
                                //getPopupContainer={trigger => trigger.parentElement}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                            name="submit_deadline"
                            label="比赛起止时间"
                            rules={[{ required: true, message: '比赛截止时间不能为空' }]}
                            >
                                <RangePicker
                                style={{ width: '100%' }}
                                locale={locale}
                                // getPopupContainer={trigger => trigger.parentElement}
                                format="YYYY-MM-DD HH:mm"
                                showTime={{ format: 'HH:mm' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
            <Modal
            destroyOnClose
            title="选择评委"
            visible={modalVisible}
            okText='提交'
            cancelText='取消'
            onOk={handleOk}
            // confirmLoading={confirmLoading}
            onCancel={handleCancel}
            >
                <Space direction="vertical">{ judgeView }{ options }</Space>
            </Modal>
        </div>
    )
}

export default Released;