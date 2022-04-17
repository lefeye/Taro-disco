import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { Form, Input, Button, message, List, Avatar, Modal } from 'antd';
import { NotificationOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Date from '../../../components/Date/index'
import url from '../../../server/api/url';
import axios from 'axios';
import './Annoucement.css'
const layout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 16,
    },
};

export default function Annoucement() {
    const [annoucements, setAnnouncements] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [refresh, setRefresh] = useState(false)
    useEffect(() => {
        const URL = url + "/findAllAnnouncement?limit=100&page=1";
        axios({
            method: "get",
            url: URL,
            // headers: {
            //     "key": "Authorization",
            //  "value": "Bearer " + sessionStorage.getItem('token')
            // }
        }).then(response => {
            const data = response.data["announcements"];
            setAnnouncements(data);
            console.log(2)
            console.log(data);
        })
            .catch(function (error) {
                console.log(1)
                console.log(error);
            });
    }, [refresh])
    const onFinish = (values) => {
        console.log(values);
        const URL = url + '/addAnnouncement';
        axios({
            method: "POST",
            url: URL,
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('token')
            },
            data: {
                "title": values.annoucement.title,
                "content": values.annoucement.content
            }
        }
        ).then(data => {
            console.log(data.data)
            if (data.data.code === "BS2015") {
                message.success('发布公告成功！')
            }
            else {
                message.error('发布公告失败！')
            }
        }).catch(e => {
            console.log(e)
        })
    };

    const showModal = () => {
        setIsModalVisible(true);
    }
    const handleOk = () => {
        console.log(title, content)
        const URL = url + '/addAnnouncement';
        axios({
            method: "POST",
            url: URL,
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('token')
            },
            data: {
                "title": title,
                "content": content
            }
        }
        ).then(data => {
            console.log(data.data)
            if (data.data.code === "BS2015") {
                message.success('发布公告成功！')
            }
            else {
                message.error('发布公告失败！')
            }
        }).catch(e => {
            console.log(e)
        })
        setIsModalVisible(false);
        setRefresh(!refresh)
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    return <div>
        <h3 className='titleA'>已发布公告</h3>
        <Button onClick={showModal} className='buttom'><PlusCircleOutlined />新增公告</Button>
        <List
            itemLayout="horizontal"
            dataSource={annoucements}
            renderItem={item => {
                const month = item['created_at'].split(' ')[0].split('-')[1];
                const day = item['created_at'].split(' ')[0].split('-')[2];
                console.log(item['created_at'])
                return (
                    <List.Item>
                        <Date day={day} month={month}></Date>
                        <List.Item.Meta
                            // avatar={<NotificationOutlined style={{ fontSize: '26px', color: '#08c' }} />}
                            style={{ marginLeft: '2em' }}
                            title={`${item.title}`}
                            description={`详情:` + `${item.content}`}
                        />
                    </List.Item>
                )
            }}
            style={{ margin: 'auto', width: '90%' }}
        />
        <Modal title="发布公告" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <Input placeholder="标题（必填）" onChange={title => setTitle(title.nativeEvent.data)} />
            <br />
            <Input.TextArea placeholder="公告内容（必填）" rows={4} onChange={content => setContent(content.nativeEvent.data)} />

        </Modal>
    </div>;
}
