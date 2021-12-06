import React from 'react'
import { message,Upload, Button, } from 'antd';
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons';
import url from '../../server/api/url';
export default function Download() {
    const handleClick = () => {
      axios({
        method: "GET",
        url: `${url}/api/v1/setting/competition/work-link?competition_id=5&user_id=2`,
        headers: {
            'token': sessionStorage.getItem('token')
        }
    }).then( data =>{
      console.log(data);
    }).catch(e=>{
      console.log(e);
    })
    }
    return (
        <div>
          <p>测试页面</p>
          <Button onClick={handleClick}>请求比赛作品链接</Button>
        </div>
        
    )
}
