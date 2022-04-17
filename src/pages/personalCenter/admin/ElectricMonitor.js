import React, { useState, useEffect, useRef } from 'react'
import './EletricMonitor.css'
import url from '../../../server/api/url'
import axios from 'axios'
import { Table, Badge, Avatar } from 'antd';

export default function ElectricMonitor() {
    const [electricData, setElectricData] = useState({});
    const [timers, setTimers] = useState([]);
    const URL = url + `/getElectricMeterData`;
    const saveCallBack = useRef();
    const callBack = () => {
        axios({
            method: 'GET',
            url: URL,
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem('token')
            }
        }).then(data => {
            console.log(data.data.data)
            setElectricData(data.data.data);
        }).catch(e => {
            console.log(e)
        })

    };
    useEffect(() => {
        callBack();
    }, [])
    useEffect(() => {
        saveCallBack.current = callBack;
        return () => { };
    });
    useEffect(() => {
        const tick = () => {
            saveCallBack.current();
        };
        const timer = setInterval(tick, 1000 * 60);
        timers.push(timer);
        setTimers(timers);
        console.log(timers);
        return () => {
            clearInterval(timer);
        };
    }, [])

    console.log(electricData.active_power[powerA])

    return (
        electricData ?
            <div>电表实时数据
                <table width={'600'} border="1">
                    <col align="left" />
                    <col align="left" />
                    <col align="left" />
                    <thead>
                        <tr>
                            <th>数据类型</th>
                            <th>A相位</th>
                            <th>B相位</th>
                            <th>C相位</th>
                            <th>总值</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>active_power</td>
                            <td>active_power</td>
                            <td>active_power</td>
                            <td>active_power</td>
                            <td>active_power</td>
                            {/* <td>{electricData.active_power['powerA'] || 0}</td>
                            <td>{electricData.active_power['powerB'] || 0}</td>
                            <td>{electricData.active_power['powerC'] || 0}</td>
                            <td>{electricData.active_power['powerTotal'] || 0}</td> */}

                        </tr>
                    </tbody>

                </table>
            </div> : ''

    )
}
