import axios from 'axios'
import React, { useState, useEffect } from 'react'
import MyCarousel from '../../components/MyCarousel/MyCarousel.js'
import Date from '../../components/Date/index'
import './index.css'
import url from '../../server/api/url'
import index from './../seatReservation/index';
import { List, Button } from 'antd'
import Modal from 'antd/lib/modal/Modal'

export default function Home() {
    const URL = url + `/findAllAnnouncement?limit=50&page=1`
    const [annouceMents, setAnnouceMents] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        axios({
            method: "GET",
            url: URL
        })
            .then(response => {
                const data = response.data;
                setAnnouceMents(data['announcements']);
                console.log(data['announcements'])
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [])

    const showContent = () => {
        setIsModalVisible(true);
    }
    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    return (
        <div>
            <div className='carousel'>
                <MyCarousel />
            </div>
            <div className="home-title">
                <i className="hr"></i>
                <span className="title">实验室简介</span>
            </div>
            <div className="home-content">
                <span>  华南理工大学智能系统未来创新实验室(SCUT IS-LAB)围绕智能硬件、
                    软件、计算和互联四方面内容开展研究、推广和人才培养工作，
                    构建“智能系统”，让人类生活更加智能。</span>
            </div>
            <br />
            <div className="home-title">
                <i className="hr"></i>
                <span className="title">最新公告</span>
            </div>
            <div className="home-content">

                <List
                    className='list'
                    itemLayout="horizontal"
                    dataSource={annouceMents.reverse()}
                    renderItem={item => {
                        const month = item['created_at'].split(' ')[0].split('-')[1];
                        const day = item['created_at'].split(' ')[0].split('-')[2];
                        console.log(item['created_at'])
                        return (
                            <List.Item className='listItem'>
                                <Date day={day} month={month}></Date>
                                <List.Item.Meta
                                    style={{ marginLeft: '10px' }}
                                    title={<Button type="text" block onClick={showContent}>`${item.title}`</Button>}
                                />
                                <Modal
                                    title={item.title}
                                    visible={isModalVisible}
                                    onOk={handleOk}
                                    onCancel={handleCancel}
                                    mask='false'
                                >
                                    {item.content}
                                </Modal>
                            </List.Item>
                        )
                    }}
                />

            </div>

        </div>
    )
}
