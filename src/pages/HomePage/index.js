import React from 'react'
import MyCarousel from '../../components/MyCarousel'
import './index.css'

export default function Home() {
    return (
        <div>
            <div className='carousel'>
                <MyCarousel />
            </div>
            <div className="home-title">
                <i className="hr"></i>
                <span className="title">实验室简介</span>
            </div>
            <div className="home-content">
                <span>  华南理工大学智能系统未来创新实验室(SCUT IS-LAB)围绕智能硬件、
                    软件、计算和互联四方面内容开展研究、推广和人才培养工作，
                    构建“智能系统”，让人类生活更加智能。</span>
            </div>
            <br />
            {/* <div className="home-title">
                <i className="hr"></i>
                <span className="title">比赛讯息</span>
            </div>
            <div className="home-content">
                <span>  </span>
            </div> */}
        </div>
    )
}
