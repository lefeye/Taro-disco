import React from 'react';
import img234 from '../../imgs/234-1.jpg'
import img351 from '../../imgs/351-1.jpg'
import { Link } from 'react-router-dom'

export default function ChooseLab() {
    return (<div>
        <div class="row">
            <div class="col-sm-6 col-md-4">
                <div class="thumbnail">
                    <img src={img234} alt="..." />
                    <div class="caption">
                        <h3>B3-234(40个机位)</h3>
                        <p>
                            <Link to="/home/seatReservation/lab_234" class="btn btn-primary" role="button">点击预约</Link>
                        </p>
                    </div>
                </div>
                <div class="thumbnail">
                    <img src={img351} alt="..." />
                    <div class="caption">
                        <h3>B3-351(座位预约,只有4台机位可以预约))</h3>
                        <p>
                            <Link to="/home/seatReservation/lab_351" class="btn btn-primary" role="button">点击预约</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>);
}
