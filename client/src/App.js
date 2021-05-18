import React, { Fragment } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import './App.css';

import Home from "./pages/Home";
import Rezerwacje from "./pages/Rezerwacje";
import Login from "./pages/Login";
import Rejestracja from "./pages/Rejestracja";
import Error from "./pages/Error";
import Navbar from "./components/Navbar"
//import Camera from "./components/Camera"
import Test from "./pages/Test";
import Test2 from "./pages/Test2";
import Administration from "./pages/Administration"
import UserPanel from "./pages/UserPanel"

import CreateRoom from "./components/CreateRoom";
import { UserProvider} from './context/UserContext.js';
import OnlyUserRoute from './components/OnlyUserRoute';
import OnlyAdminRoute from './components/OnlyAdminRoute';
//import Room from "./pages/Test";
import Cam from './components/newCamera'
import Monitoring from './pages/Monitoring'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  return (
    <Fragment>
      <Router>
      <UserProvider>
        <Navbar/>
        <Switch> 
          <Route exact path="/" component={Home}/>
          <OnlyUserRoute path="/rezerwacja/" component={Rezerwacje}/>
          <OnlyUserRoute path="/userpanel" component={UserPanel} />
          <Route path="/rejestracja/" component={Rejestracja}/>
          <Route path="/logowanie/" component={Login}/>
          <OnlyAdminRoute path="/administrator" component={Administration}/>
          <OnlyAdminRoute path="/monitoring" component={Monitoring}/>
          <Route component={Error} />

        </Switch>
      </UserProvider>
      </Router>
    </Fragment>
  )
}


/*
          <Route path="/test/:roomID" component={Test} />
          <OnlyUserRoute path="/test2/:roomID" component={Test2} />
          <OnlyAdminRoute path="/y" exact component={CreateRoom}/>
          <Route path="/test" component={Test}/>
          <Route path="/test2" component={Test2}/>
          <Route path="/aaa" component={Cam} />
          <Route path="/test" component={Test}/>
          <Route path="/test2" component={Test2}/>
*/