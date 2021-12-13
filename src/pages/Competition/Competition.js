import React, { useState, useEffect } from 'react'
import {
    Button,
    List,
    Spin,
    Empty,
    Pagination
} from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import './index.css'
import axios from 'axios';
import url from '../../server/api/url';

export default function Competition() {
    const history = useHistory()
    const [load, setLoad] = useState(true);            //加载中
    const [total,setTotal] = useState(0)               //列表总数
    const [element, setElement] = useState([]);        //列表
    const [min,setMIn] = useState(0);                  //每列第一个 
    const [max,setMax] = useState(10);                 //每列最后一个

    //请求列表
    useEffect(() => {
        axios({
            method: "GET",
            url: `${url}/api/v1/user/competition/get-list`,
            headers: {
                'token': sessionStorage.getItem('token')
            }
        }).then(data => {
            if (data.data.status == 200) {
                const data1 = data.data.data.reverse();
                setTotal(data1.length);
                setLoad(false);//把加载中图标取消掉
                setElement(data1);
            }
        }).catch(e => {
            console.log(e)
        })
    },[]
    )

    //更换分页的页数
    const handleChange = value => {
        setMax(value*10);
        setMIn((value-1)*10);
    }
    const spin = (<LoadingOutlined style={{ fontSize: 24 }} spin />);
    return (
        <div>
            {load === true ?
                    <Spin indicator={spin} tip='loading' style={{ margin: '0 auto' }} />
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
                    : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='暂无数据' />}
            <Pagination defaultCurrent={1} onChange={handleChange} total={total} hideOnSinglePage style={{marginleft:'80%'}}/>
        </div>
    )
}
