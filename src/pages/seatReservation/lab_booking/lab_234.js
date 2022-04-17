import React, { useEffect, useState } from 'react';
import url from '../../../server/api/url';
import 'antd/dist/antd.css';
import { Menu, Layout, Row, Col, Modal, message } from 'antd';
import axios from 'axios';
import { AppstoreOutlined, DesktopOutlined } from '@ant-design/icons';
import './lab_234.css'
import store from '../../../redux/store'


export default function lab_234() {
    const lab_name = 'B3-234';
    const userAccount = store.getState().userInfo.account;
    const [dateTitle, setDateTitle] = useState([]);
    const [current, setCurrent] = useState('1');
    const [period, setPeriod] = useState('');
    const [date, setDate] = useState('');
    const [choseSeat, setChoseSeat] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [reservedPeriod, setReservedPeriod] = useState([]);
    const periodArr = ['8:50:00-10:25:00', '10:40:00-12:15:00', '14:00:00-15:35:00', '15:50:00-17:25:00', '19:00:00-21:00:00']
    const [seat, setSeat] = useState([]);
    const { SubMenu } = Menu;
    const { Header, Content, Footer, Sider } = Layout;
    const handleClick = e => {
        setCurrent(e.key)
        console.log('click ', e.key);
    };
    const handleOk = () => {
        const URL = url + `/reverseSeat`
        axios({
            method: "POST",
            url: URL,
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('token')
            },
            data: {
                "account": userAccount,
                "lab_name": lab_name,
                "seat_name": choseSeat,
                "reserve_date": date,
                "time_interval": period,
            }
        }).then(data => {
            console.log(data.data)
            message.success('预约成功')
        }).catch(err => {
            console.log(err)
            message.error('预约失败')
        })

        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    //选择时间段获取该时间段的预约信息
    const choosePeriod = (e) => {
        const nowPeriod = e.domEvent.target.innerHTML//获取节点中的时间段
        const dateIdx = e.keyPath[1].substr(e.keyPath[1].length - 1, 1)
        const nowDate = dateTitle[dateIdx];//获取该时间点属于的日期

        setPeriod(nowPeriod);
        setDate(nowDate);

        console.log(nowPeriod);
        console.log(nowDate)
        const URL = url + `/searchSeat`
        axios({
            method: "POST",
            url: URL,
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('token')
            },
            data: {
                "lab_name": lab_name,
                "reserve_date": nowDate,
                "time_interval": nowPeriod
            }
        }
        ).then(data => {
            console.log(data.data)
            if (data.data.status === 'BS2011')
                if (data.data.data)
                    setReservedPeriod(data.data.data)
            console.log('ss:', data.data.data)
        }).catch(err => {

            console.log(err)
        })
    };

    const showModal = (seat) => {
        if (userAccount) {
            setChoseSeat(seat)
            setIsModalVisible(true);
        }

        else {
            message.warn('请先登录')
        }
    };
    const showBad = () => {
        message.warn('该设备故障，请预约其他设备');
    }
    const showMessage = () => {
        message.warning('请先选择左边菜单时间段');
    }
    useEffect(() => {
        const today = new Date();
        const dateArr = [];
        for (let i = 0; i < 8; i++) {
            const newDate = new Date(today.getTime() + i * 1000 * 60 * 60 * 24)
            const year = newDate.getFullYear()
            const month = (parseInt(newDate.getMonth()) + 1) > 9 ? (parseInt(newDate.getMonth()) + 1) : "0" + (parseInt(newDate.getMonth()) + 1)
            const day = (newDate.getDate()) > 9 ? newDate.getDate() : "0" + newDate.getDate()
            const fullDate = `${year}-${month}-${day}`
            dateArr.push(fullDate)
        }
        dateArr.shift();
        console.log(dateArr);
        setDateTitle(dateArr);
    }, ['1', period, date])
    useEffect(() => {
        const Url = url + '/findAllSeat';
        axios({
            method: "POST",
            url: Url,
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('token')
            },
            data: {
                "lab_name": lab_name
            }
        })
            .then(response => {
                setSeat(response.data.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [])

    return (
        <Layout style={{ minHeight: '90vh' }}>
            <Sider >
                <Menu
                    theme='light'
                    onClick={handleClick}
                    style={{ marginTop: 64 }}
                    selectedKeys={[current]}
                    mode="inline"
                >
                    {
                        dateTitle.map((date, idx) => {
                            return (
                                <SubMenu key={`sub${idx}`} icon={<AppstoreOutlined />} title={date}>
                                    {
                                        periodArr.map((item, index) => {
                                            return (<Menu.Item key={`sub${idx}-item${index}`} onClick={choosePeriod}>{item}</Menu.Item>)
                                        })
                                    }
                                </SubMenu>
                            )
                        })
                    }

                </Menu>

            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0 }} >座位预约/B3-234</Header>
                <Content style={{ margin: '0 10px' }}>
                    <div className="site-layout-background" style={{ fontSize: 16, color: 'black', padding: 24, minHeight: 20 }}>
                        每人每天只可在同一时间预约一个座位
                    </div>
                    <div>
                        <div className='platform'><span>讲台</span></div>
                        <Row gutter={[16, 16]} style={{ width: '80%', margin: 'auto' }}>
                            {
                                seat.map((item, index) => {
                                    console.log(item)
                                    return (
                                        <Col className="gutter-row"
                                            span={3}
                                            key={item.seat_name}>
                                            <div onClick={e => console.log(e)}>
                                                <DesktopOutlined
                                                    className={reservedPeriod.indexOf(item.seat_name) !== -1 ? 'desktopIconNo' : item.status === 0 ? 'desktopIcon' : 'desktopIconNo'}
                                                    onClick={item.status == !0 ? () => showBad() : period ? () => showModal(item.seat_name) : () => showMessage()}

                                                />
                                                <span style={{ color: 'black' }}>{item.seat_name}</span>
                                            </div>
                                            <Modal title="确认预约信息" visible={isModalVisible} onOk={() => handleOk()} onCancel={handleCancel}>
                                                <p>预约座位:{choseSeat}</p>
                                                <p>预约时间:{period}</p>
                                                <p>预约日期:{date}</p>
                                            </Modal>

                                        </Col>)
                                })
                            }

                        </Row>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>华南理工大学计算机科学与工程学院</Footer>
            </Layout>
        </Layout>);
}
