import React from 'react'
import { message,Upload, Button, } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import url from '../../server/api/url';
export default function Download() {
    const props = {

    name: 'file',
    action: `${url}/api/v1/user/competition/post-work?competition_id=${1}`,
    headers: {
      'token':sessionStorage.getItem('token'),
      'X-Requested-With':null
    },
    onChange(info) {
      console.log(info.file)
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    };
    return (
        <div>
            <p>测试页面</p>
            <Upload {...props}>
        <Button icon={<UploadOutlined />}>点击上传文件</Button>
        </Upload>
        </div>
        
    )
}
