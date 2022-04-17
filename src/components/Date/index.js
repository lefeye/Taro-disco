import React from 'react'
import './index.css'

export default function index(props) {
    console.log(props)
    const month = props.month;
    const day = props.day;
    return (
        <div className='whole'>
            <div className='day'>{day}</div>
            <div className='month'>{month}月</div>
        </div>
    )
}
