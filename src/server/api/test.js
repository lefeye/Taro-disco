import React from 'react'
import axios from 'axios';
import { useState } from 'react'


export default function test() {
    const [data1, setData1] = useState({})
    const handle = () => {
        let url = "http://127.0.0.1:3001/api/";
        axios.get(url)
            .then(function (response) {
                const data = response.data;
                setData1(data);
                console.log(data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    return (
        <div>
            <button onClick={handle}>click me to get data</button>
            <p>
                {data1.message}
            </p>
        </div>
    )
}
