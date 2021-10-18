import logo from './logo.svg';
import './App.css';
import MyNavLink from './components/MyNavLink'
import MyCarousel from './components/MyCarousel';
import Home from './pages/Home/Home'
import Contact from './pages/Contact/Contact'
import Download from './pages/Download/Download'
import Question from './pages/Question/Question'

import { HashRouter, Route, Switch } from 'react-router-dom'

function App() {
  return (
    <div className="App">

      <header className="App-header">
        <div className="top">
          <HashRouter>
            <div className="router-link">
              <MyNavLink to="/home">登录</MyNavLink>
              <MyNavLink to="/question">注册</MyNavLink>
            </div>
            <Switch>
              <Route path='/login' component={Home} />
              <Route path="/register" component={Question} />
            </Switch>
          </HashRouter>
        </div>
        <div className="register-router">
          <img src="./img/scut.jpeg" alt="scut" />
          <HashRouter>
            <div className="router-link">
              <MyNavLink to="/home">首页</MyNavLink>
              <MyNavLink to="/question">更多问题</MyNavLink>
              <MyNavLink to="/download">资源下载</MyNavLink>
              <MyNavLink to="/contact">联系我们</MyNavLink>
            </div>
            <Switch>
              <Route path='/' component={Home} exact />
              <Route path='/home' component={Home} />
              <Route path="/question" component={Question} />
              <Route path="/download" component={Download} />
              <Route path="/contact" component={Contact} />
            </Switch>
          </HashRouter>
        </div>

      </header >
      <div className='carousel'>
        <MyCarousel />
      </div>

    </div >
  );
}

export default App;
