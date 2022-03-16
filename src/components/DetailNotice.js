import React, { useEffect, useState } from 'react'
import GoBack from './GoBack';
export default function DetailNotice() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [created_at, setCreated] = useState('');
    useEffect( () => {
        setTitle(sessionStorage.getItem('title'));
        setContent(sessionStorage.getItem('content'));
        setCreated(sessionStorage.getItem('create'));
    },[] )
    
    return (
        <div>
            <GoBack/>
            <h3 className="content-title">{title}</h3>
            <h4 className="content-date">发布时间：{created_at}</h4>
            <hr></hr>
            <p style={{ textIndent:'2em',margin:'0 25%',fontSize:'16px' }}>
                {content}
            </p>
        </div >
    )
}