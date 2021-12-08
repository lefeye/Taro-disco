import React from 'react'
import { message,Upload, Button, } from 'antd';
import axios from 'axios';
import { UploadOutlined } from '@ant-design/icons';
import url from '../../server/api/url';
export default function Download() {
  
    return (
        <div>
          <p>测试页面</p>
          <h3>推荐使用最新版谷歌浏览器查看网页，使用其他浏览器可能会有兼容问题（应该没人用IE吧？）</h3>
          <h3>不支持移动端访问（如果您会移动端适配欢迎 加入我们）</h3>
          {/* <Button onClick={handleClick}>请求比赛作品链接</Button> */}
        </div>
        
    )
}
