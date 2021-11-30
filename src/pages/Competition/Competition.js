import React, { useState, useEffect } from 'react'
import {
    Button,
    List
} from 'antd'
import { useHistory } from 'react-router-dom'
import './index.css'
import axios from 'axios';
import url from '../../server/api/url';

export default function Competition() {
    const history = useHistory()
    // const [load, setLoad] = useState(true);
    const [element, setElement] = useState([]);
    useEffect(() => {
        axios({
            method: "GET",
            url: `${url}/api/v1/user/competition/get-list`,
            headers: {
                'token': localStorage.getItem('token')
            }
        }).then(data => {
            if (data.data.status === 200) {
                const data1 = data.data.data.reverse();
                console.log(data.data)
                // setLoad(false);//把加载中图标取消掉
                setElement(data1);
            }
        }).catch(e => {
            console.log(e)
        })
    },[]
    )

    return (
        <div>
            <List className="list"
                itemLayout="horizontal"
                bordered
                dataSource={element}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            title={
                                <Button
                                    type='link'
                                    onClick={() => { history.push('/home/detail'); sessionStorage.setItem('compId', `${item.id}`) }}>
                                    {item.title}
                                </Button>
                            }
                            description={<p>奖励：{item.reward}</p>}
                        />
                    </List.Item>
                )}
            />
        </div>
    )
}
