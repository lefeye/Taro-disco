import React from 'react';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
export default function GoBack() {
    return (
        <Button
        onClick={ ()=>{ window.history.back() } } 
        type='link' 
        icon={<LeftOutlined />}
        >
            返回
        </Button>
    )
}