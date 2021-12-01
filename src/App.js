import './App.css';
import React, { useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'
import Home from './containers/home'
import Login from './containers/Login/Login'
import Register from './containers/Register/Register'
import { useHistory } from 'react-router-dom'
import { message } from 'antd';

function App() {
  message.config({
    maxCount: 1
  })
  return (
    <div className="App">
      <div >
        <Switch>
          {/* <Redirect path='/' to="/home" /> */}
          <Route exact path='/' component={Home} />
          <Route path='/home' component={Home} />
          <Route path='/login' component={Login} />
          <Route path="/register" component={Register} />
        </Switch>
      </div>

      <footer>
        <a href=""></a>
      </footer>
    </div >
  );
}

export default App;
