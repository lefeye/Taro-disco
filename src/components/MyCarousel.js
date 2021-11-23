import React from 'react'
import { Carousel } from 'antd';
import img1 from '../imgs/lab1.jpg'
import img2 from '../imgs/scut2.jpg'
import img3 from '../imgs/gd1.jpg'

export default function Mycarousel() {
    const contentStyle = {
        height: '20em',
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
                    <h3 style={contentStyle}><img src={img1} alt="1" /></h3>
                </div>
                <div>
                    <h3 style={contentStyle}><img src={img2} alt="2" /></h3>
                </div>
                <div>
                    <h3 style={contentStyle}><img src={img3} alt="3" /></h3>
                </div>
                <div>
                    <h3 style={contentStyle}>4</h3>
                </div>
            </Carousel>
        </div >
    )
}
