import React from 'react';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
export default function GoBack() {
    const history = useHistory();
    return (
        <Button
        onClick={ ()=>{ history.goBack() } } 
        type='link' 
        icon={<LeftOutlined />}
        >
            返回
        </Button>
    )
}