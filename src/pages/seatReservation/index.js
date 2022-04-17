import React from 'react'
import { Link, Route, Switch } from 'react-router-dom'

import Lab_234 from './lab_booking/lab_234';
import Lab_351 from './lab_booking/lab_351';
import ChooseLab from './ChooseLab';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css'
import './index.css'

export default function index() {
    return (
        <div>
            <div className="router-content">
                <Switch>
                    <Route exact path='/home/seatReservation/' component={ChooseLab} />
                    <Route path='/home/seatReservation/lab_234' component={Lab_234} />
                    <Route path='/home/seatReservation/lab_351' component={Lab_351} />
                </Switch>
            </div>
        </div>
    )
}
