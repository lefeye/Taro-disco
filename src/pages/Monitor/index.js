import React from 'react'
import './index.css'
export default function index() {
    return (
        <div className='mar'>
            <iframe src='http://192.168.1.108' className='monitor'></iframe>
            {/* <video style="position: absolute; display: block;" width="100%" height="100%" autoplay="" preload="auto" src="blob:http://192.168.1.108/fecd3e94-d2ca-4623-aa12-e3072d92ed3d"></video> */}
        </div>
    )
}
