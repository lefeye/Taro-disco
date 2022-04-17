import React from 'react'
import axios from 'axios';
import { useState } from 'react'
import url from './url';

export default function Test() {
    const [data1, setData1] = useState({})
    const handle = () => {
        const URL = url + "/getReserveInfo?limit=3&page=1&account=20182022001";
        axios.get(URL)
            .then(response => {
                const data = response.data;
                setData1(data);
                console.log(2)
                console.log(data);
            })
            .catch(function (error) {
                console.log(1)
                console.log(error);
            });
    }
    const test1 = () => {
        const URL = url + "/deleteReserve";
        axios.post(URL,
            {
                "lab_id": 1,
                "seat_id": 32,
                "reserve_date": "2022-01-23",
                "time_interval": "9:00:00-11:00:00"
            }
        ).then(data => {
            console.log(2)
            console.log(data)
        }).catch(err => {
            console.log(1)
            console.log(err)
        })
    }
    // handle();
    // test1();
    return (
        <div>
            <button onClick={handle}>click me to get data</button>
            <p>
                22
            </p>
        </div>
    )
}
