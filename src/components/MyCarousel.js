import React from 'react'
import { Carousel } from 'antd';
import img1 from '../imgs/lab1.jpg'
import img2 from '../imgs/scut2.jpg'
import img4 from '../imgs/dang.jpg'

export default function Mycarousel() {
    const contentStyle = {
        height: '50vh',
        width: '100%',
        color: '#fff',
        lineHeight: '45vh',
        textAlign: 'center',
        background: '#364d79',
        marginBlockStart: '0'
    };
    return (
        <div>
            <Carousel autoplay >
                <div>
                    <h3 style={contentStyle}><img src={img1} alt="1" width='100%'/></h3>
                </div>
                <div>
                    <h3 style={contentStyle}><img src={img2} alt="2" width='100%'/></h3>
                </div>
                <div>
                    <h3 style={contentStyle}><img src={img4} alt="4" width='100%'/></h3>
                </div>
            </Carousel>
        </div >
    )
}
