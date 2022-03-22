import React, { useEffect, useState } from 'react'
import MyCarousel from '../../components/MyCarousel'
import './index.css'
import beian from '../../imgs/beian.png';
import moment from 'moment';
import url from '../../server/api/url';
import new_axios from '../../server/api/axios';
import { message, List, Button } from 'antd';
import { useHistory } from 'react-router-dom';
export default function Home() {
    const history = useHistory();
    const [noticeList,setNoticeList] = useState([])
    useEffect( () => {
        new_axios({
            method:'GET',
            url:url+'/api/v1/announcement/get-list?limit=5&page=1'
        }).then( res => {
            if(res.data.code === '200'){
                const arr = [];
                res.data.data.data.forEach( item => {
                    let i = item;
                    i.created_at = moment(i.created_at);
                    i.updated_at = moment(i.updated_at);
                    arr.unshift(item);
                } )
                setNoticeList(arr);
            }
            else{
                message.error(res.data.msg);
            }
        } )
    } ,[])

    const keepInfo = value => {
        sessionStorage.setItem('title',value.title);
        sessionStorage.setItem('content',value.content);
        sessionStorage.setItem('create',moment(value.created_at).format('l'));
      
    }
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
                <span className="title">通知公告</span>
            </div>
            <div className="home-content2">
                <div>
                <List
                style={ { fontWeight:'bold',width:'500px' } }
                dataSource={noticeList}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                        avatar={ 
                        <div className='avatar'>
                            <div>{moment(item.created_at).format("M")}月</div>
                            <div>{moment(item.created_at).format("D")}日</div>
                        </div> }
                        title={<a style={{ fontWeight:'bold'}} href='/home/detailNotice' onClick={ () => { keepInfo(item) } }>{item.title}</a>}
                        description={ item.contest_id===0? '常规公告':'比赛/项目专有公告' }
                        />
                    </List.Item>
                )}
                footer={<div className='more'><Button type='link' onClick={ () => { history.push('/home/notice') } }>更多通知</Button></div>}
                />
                </div>
                <span>  </span>
            </div>
            <footer className='foot'>
                <img src={beian} alt='备案'></img>
                <a href="http://www.beian.gov.cn" target="_blank" rel="noopener noreferrer">公网安备 44011302003329号   </a>
                <a href="http://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer">琼ICP备2021009023号</a>
                <div><span>链接至：</span><a href='https://www.scut.edu.cn/new' target="_blank" rel="noopener noreferrer">华南理工大学</a></div>
            </footer>
        </div>
    )
}
