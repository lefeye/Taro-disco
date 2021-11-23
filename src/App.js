import './App.css';
import { Route, Switch } from 'react-router-dom'
// import PersonalCenter from './containers/personalCenter/PersonalCenter'
import Home from './containers/home'
import Login from './containers/Login/Login'
import Register from './containers/register/Register'


function App() {
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
        <a href=""></a>
      </footer>
    </div >
  );
}

export default App;
