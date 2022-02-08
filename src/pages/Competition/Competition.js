import React, { useState, useEffect } from 'react'
import {
    Button,
    List,
    Spin,
    Empty,
    Pagination,
    message
} from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import './index.css'
import new_axios from '../../server/api/axios'
import url from '../../server/api/url';

export default function Competition() {
    const history = useHistory()
    const [load, setLoad] = useState(true);
    const [total,setTotal] = useState(0)
    const [element, setElement] = useState([]);
    const [min,setMIn] = useState(0);
    const [max,setMax] = useState(10);
    useEffect(() => {
        new_axios({
            method: "GET",
            url: `${url}/api/v1/setting/contest/get-list`,
        }).then(data => {
            if (data.data.code === '200') {
                const data1 = data.data.data.data.reverse();
                setTotal(data1.length);
                console.log(data.data)
                setLoad(false);//把加载中图标取消掉
                setElement(data1);
            }
            else{
                message.error(data.data.msg);
            }
        }).catch(e => {
            console.log(e)
        })
    },[]
    )

    const handleChange = value => {
        setMax(value*10);
        setMIn((value-1)*10);
    }
    const spin = (<LoadingOutlined style={{ fontSize: 24 }} spin />);
    return (
        <div>
            {load === true ?
                    <Spin indicator={spin} tip='loading' size='large' style={{ marginLeft: '49%',marginTop:'20%' }} />
                    : element.length > 0 ?
                    <List className="list"
                    itemLayout="horizontal"
                    header={<h2 style={{textAlign:'center'}}>比赛列表</h2>}
                    bordered
                    dataSource={element.slice(min,max)}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                title={
                                    <a style={{ fontWeight:'bold' }}
                                        onClick={() => { history.push('/home/detail'); sessionStorage.setItem('compId', `${item.id}`) }}>
                                        {item.title}
                                    </a>
                                }
                                description={<p>发布时间：{item.created_at}</p>}
                            />
                        </List.Item>
                    )}
                    />
                    : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无数据' />}
            <Pagination defaultCurrent={1} onChange={handleChange} total={total} hideOnSinglePage style={{marginleft:'80%'}}/>
        </div>
    )
}
