import React, { useEffect, useState } from 'react'
import { message,List } from 'antd';
import url from '../../server/api/url';
import new_axios from '../../server/api/axios';
import './Notice.css';
import moment from 'moment';
import keepInfo from '../../server/api/keepInfo';
export default function Download() {
    const [noticeList,setNoticeList] = useState([]);
    const [total,setTotal] = useState(0);
    useEffect( () => {
      new_axios({
        method:'GET',
        url:url+'/api/v1/announcement/get-list?limit=10&page=1'
      }).then( res => {
        if(res.data.code === '200'){
          setNoticeList(res.data.data.data);
          setTotal(res.data.data.total);
        }
        else{
          message.error(res.data.msg);
        }
      } ).catch( e => {
        console.log(e);
      } )
    } ,[])
    const pageChange = page => {
      new_axios({
        method:'GET',
        url:url+`/api/v1/announcement/get-list?limit=10&page=${page}`
      }).then( res => {
        if(res.data.code === '200') {
          setNoticeList(res.data.data.data)
        }
        else{
          message.error(res.data.msg);
        }
      } )
    }
    return (
        <div className='bo'>
          <h1>通知公告</h1>
            <List
            style={ { fontWeight:'bold' } }
            dataSource={noticeList}
            pagination={
              {
                pageSize:10,
                total:total,
                onChange:pageChange
              }
            }
            renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                    title={<a style={{ fontWeight:'bold'}} href='/home/detailnotice'onClick={() => { keepInfo(item) }}>{item.title}</a>}
                    />
                      <div>{moment(item.created_at).format('l')}</div>
                </List.Item>
            )}
            />
        </div>
        
    )
}
