import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Card } from 'antd';
import url from './../../server/api/url';
import axios from 'axios';
import competion_1 from '../../imgs/competition_1.jpg'

function Contest() {
    const [competitionData, setCompetionData] = useState([])

    useEffect(() => {
        axios({
            method: "GET",
            url: `${url}/api/v1/user/own/competition`,
            headers: {
                'token': localStorage.getItem('token')
            }
        }).then(data => {
            setCompetionData(data.data.data)
        })
    })
    const style = {
        'width': '90%',
        'display': 'flex',
        'margin': '0 auto'
    }
    return (
        <div>
            <Card
                hoverable
                style={style}
                cover={<img alt="example" src={competion_1} style={{ width: '40%' }} />}
            >
                <p >nihaoaaaa</p>
            </Card>
        </div>
    )
}

export default Contest;