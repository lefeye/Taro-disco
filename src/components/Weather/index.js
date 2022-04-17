import React, { useState, useEffect } from 'react'
import url from '../../server/api/url'
import axios from 'axios'
export default function index(props) {
    const positive = props.positive;
    const [weather, setWeather] = useState({})
    let URL = '';
    useEffect(() => {
        if (positive === 'in') {
            URL = url + '/getInsideWeather'
            axios({
                method: 'POST',
                url: URL,
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem('token')
                }
            }).then(response => {
                if (response.data.code === 'BS2032') {
                    console.log(response.data.data)
                    setWeather(response.data.data)
                }

            }).catch(error => console.log(error))
        }
        else {
            URL = url + '/getOutsideWeather'
            axios.post(URL).then(response => {
                if (response.data.code === 'BS2030') {
                    console.log(response.data.data)
                    setWeather(response.data.data)
                }

            }).catch(error => console.log(error))
        }
    }, [])
    if (positive === 'out') {
        return (
            <div className='weather'>
                <p>广东省 广州市</p>
                <p>当前气温：{weather['temperature']}℃</p>
                <p>{weather['weather']}</p>

            </div>
        )
    }
    return (
        <div className='weather'>
            <p>实验室内部温湿度</p>
            <p>当前温度：{weather['temperature']}℃</p>
            <p>当前湿度：{weather['humidity']}</p>
        </div>
    )
}
