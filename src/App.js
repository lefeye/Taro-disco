import './App.css';
import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom'
import Home from './containers/home'
import Login from './containers/Login/Login'
import Register from './containers/Register/Register'
import { useHistory } from 'react-router-dom'
import { message } from 'antd';

function App() {
  const history=useHistory();
  message.config({
    maxCount:1
  })
  // useEffect(()=>{
  //   history.push('/home/homepage')
  // })
  return (
    <div className="App">
      <div >
        <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/home' component={Home} />
          <Route path='/login' component={Login} />
          <Route path="/register" component={Register} />
        </Switch>
      </div>

      <footer>
        {/* <a href=""></a> */}
      </footer>
    </div >
  );
}

export default App;
