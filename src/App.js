import './App.css';
import MyNavLink from './components/MyNavLink'
import MyCarousel from './components/MyCarousel';
import Home from './pages/Home/Home'
import Contact from './pages/Contact/Contact'
import Download from './pages/Download/Download'
import Question from './pages/Question/Question'
import Login from './pages/Login/index'
import Register from './pages/Register/index'
import { layout } from 'antd'
import { Route, Switch } from 'react-router-dom'
import img1 from './imgs/scut0.png'

function App() {
  return (
    <div className="App">
      <div className="top">

        <div className="router-link">
          <MyNavLink to="/login">登录</MyNavLink>
          <MyNavLink to="/register">注册</MyNavLink>
        </div>
        <Switch>
          <Route path='/login' component={Login} />
          <Route path="/register" component={Register} />
        </Switch>
      </div>

      <header className="App-header">

        {/* <div className="register-router"> */}
        <div className="club_title">
          <img src={img1} alt="scut" />
          <div>
            华南理工大学智能系统未来创新实验室
          </div>
        </div>
        <div className="router-link">
          <MyNavLink to="/home">首页</MyNavLink>
          <MyNavLink to="/question">更多问题</MyNavLink>
          <MyNavLink to="/download">资源下载</MyNavLink>
          <MyNavLink to="/contact">联系我们</MyNavLink>
        </div>

        {/* </div> */}
      </header >
      <div className="router-content">
        <Switch>
          <Route path='/' component={Home} exact />
          <Route path='/home' component={Home} />
          <Route path="/question" component={Question} />
          <Route path="/download" component={Download} />
          <Route path="/contact" component={Contact} />
        </Switch>
      </div>
      <footer>
        <a href=""></a>
      </footer>
    </div >
  );
}

export default App;
