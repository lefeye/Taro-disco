import './App.css';
import { Route, Switch } from 'react-router-dom'
// import User from './pages/User/index'
// import SignUp from './pages/SignUp/index'

import Home from './containers/home'
import Login from './containers/login'
import Register from './containers/register'

function App() {
  return (
    <div className="App">
      <div className="top">
        <Switch>
          <Route path='/' component={Home} />
          <Route path='/home' component={Home} />
          <Route path='/login' component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/admin" component={Register} />
          {/* <Route path='/user' component={User} />
          <Route path='/signUp' component={SignUp} /> */}
        </Switch>
      </div>

      <footer>
        <a href=""></a>
      </footer>
    </div >
  );
}

export default App;
