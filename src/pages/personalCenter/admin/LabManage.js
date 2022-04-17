import './LabManage.css'
import url from "../../../server/api/url";
import { useHistory } from 'react-router-dom';
import {
    Button, message, Input,
    Tabs, Modal, Col, Row, Popover
} from "antd";
import { DesktopOutlined, PlusCircleOutlined } from '@ant-design/icons';

import axios from "axios";
import React, { useEffect, useState } from "react";
import '../../../server/api/dateChange'

const LabManage = () => {
    const [allLab, setAllLab] = useState([]);
    const [labName, setLabName] = useState('');
    const { TabPane } = Tabs;
    const history = useHistory();
    const [tabSeat, setTabSeat] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newEquipment, setNewEquipment] = useState('');
    const callback = (lab_name) => {
        setLabName(lab_name)
        const URL = url + '/findAllSeat'
        axios({
            method: "POST",
            url: URL,
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('token')
            },
            data: {
                "lab_name": lab_name
            }
        })
            .then(response => {
                setTabSeat(response.data.data);
                console.log(response.data.data)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    useEffect(() => {
        //获取所有预约数据
        const URL1 = url + '/findAllLab?limit=10&page=1';
        axios({
            method: "get",
            url: URL1,
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('token')
            }
        }).then(response => {
            if (response.data.code == 'BS2008') {
                setAllLab(response.data.data);
                callback(response.data.data[0].lab_name)
            }
            else {
                message.warn('网络出错，请稍后再试')
            }
        }).catch(e => {
            console.log(e)
        })
    }, [])

    const setAsFault = (e) => {
        console.log(e)
        const URL = url + '/setBreakdown'
        axios({
            method: "POST",
            url: URL,
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('token')
            },
            data: {
                "lab_name": labName,
                "seat_name": e
            }
        })
            .then(response => {
                console(response.data)
                if (response.data.code === 'BS2022')
                    message.success('座位已设置故障')
            })
            .catch(function (error) {
                console.log(error);
            });
        history.go(0);
    }
    const setRepaired = (e) => {
        console.log(e)
        const URL = url + '/setNormal'
        axios({
            method: "POST",
            url: URL,
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('token')
            },
            data: {
                "lab_name": labName,
                "seat_name": e
            }
        })
            .then(response => {
                if (response.data.code === 'BS2023')
                    message.success('座位已恢复正常')
            })
            .catch(function (error) {
                console.log(error);
            });
        history.go(0);
    }
    const text = <span>设备状态设置</span>;
    const content = (seat) => {
        return (
            <div>
                <Button type="primary" onClick={() => setAsFault(seat.seat_name)} disabled={seat.status ? true : false}>设为‘故障’</Button>
                <Button type="primary" onClick={() => setRepaired(seat.seat_name)} disabled={seat.status ? false : true}>故障已修复</Button>
            </div>)
    }

    const addSeat = () => {

    }
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        const URL = url + '/addSeat';
        axios({
            method: "POST",
            url: URL,
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('token')
            },
            data: {
                "lab_name": labName,
                "seat_id": tabSeat.length + 1,
                "seat_name": newEquipment
            }
        }).then(response => {
            if (response.data.status === 'BS2005')
                message.success('添加成功')
            else message.error('网络错误，请稍后重试')
        }).catch(function (error) {
            message.error('添加失败')
        });
        setIsModalVisible(false);
        history.go(0);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    return (
        <Tabs defaultActiveKey="1" onChange={callback}>
            {allLab.map((item, index) => {
                return (<TabPane tab={item.lab_name} key={item.lab_name}>
                    {item.lab_name === "b3-234" ?
                        <div>
                            <div className='platform'><span>讲台</span></div>
                            <Row gutter={[16, 16]} style={{ width: '80%', margin: 'auto' }}>
                                {
                                    tabSeat.map((item, index) => {
                                        return (
                                            <Col className="gutter-row"
                                                span={3}
                                                key={item.seat_name}>
                                                <Popover placement="topLeft" title={text} content={content(item)} >
                                                    <div>
                                                        <DesktopOutlined className={item.status === 0 ? 'normal' : 'breakDow'} />
                                                        <span style={{ color: 'black' }}>{item.seat_name}</span>
                                                    </div>
                                                </Popover>
                                            </Col>)
                                    })
                                }

                            </Row>
                            <Button onClick={showModal} style={{ margin: '10px auto', display: 'inherit' }}><PlusCircleOutlined />新增座位</Button>
                            <Modal title='设备新增' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                                新增设备名：
                                <Input onChange={(e) =>
                                    setNewEquipment(e.target.value)
                                } />
                            </Modal>
                        </div>
                        : item.lab_name === "b3-351" ?
                            <div>
                                <Row gutter={[8, 8]} className='style_351' >
                                    {
                                        tabSeat.map((item, index) => {
                                            return (
                                                <Col className="gutter-row"
                                                    span={3}
                                                    key={item.seat_name}>
                                                    <Popover placement="topLeft" title={text} content={content(item)} >
                                                        <div>
                                                            <DesktopOutlined className={item.status === 0 ? 'normal' : 'breakDow'} />
                                                            <span style={{ color: 'black' }}>{item.seat_name}</span>
                                                        </div>
                                                    </Popover>
                                                </Col>)
                                        })}
                                </Row>
                                <Button onClick={showModal} style={{ margin: '10px auto', display: 'inherit' }}>
                                    <PlusCircleOutlined />新增座位</Button>
                                <Modal title='设备新增' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                                    新增设备名：
                                    <Input onChange={(e) => setNewEquipment(e.target.value)} />
                                </Modal>
                            </div> : '...'}
                </TabPane>)
            })}
        </Tabs>
    )
}

export default LabManage;