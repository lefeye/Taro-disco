import React from 'react'
import { Carousel } from 'antd';

import img1 from '../../imgs/234.jpg'
import img2 from '../../imgs/351.jpg'

export default function Mycarousel() {
    const contentStyle = {
        height: '18em',
        width: '100%',
        color: '#fff',
        lineHeight: '45vh',
        textAlign: 'center',
        background: 'rgba(91, 136, 235, 0.377);',
        marginBlockStart: '0'
    };
    const pictureStyle = {
        margin: '0 auto',
        width: '95%'
    }
    return (
        <div>
            <Carousel autoplay >
                <div >
                    <h3 style={contentStyle}><img src={img1} alt="234" style={pictureStyle} /></h3>
                </div>
                <div >
                    <h3 style={contentStyle}><img src={img2} alt="351" style={pictureStyle} /></h3>
                </div>
            </Carousel>
        </div >
    )
}
