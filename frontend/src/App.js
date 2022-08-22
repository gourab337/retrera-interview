import React, { useEffect } from 'react';
import {
  Switch,
  Route,
  useLocation
} from 'react-router-dom';

import './css/style.scss';

import AOS from 'aos';
import Sticky from 'sticky-js';
import { focusHandling } from 'cruip-js-toolkit';

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import PageNotFound from './pages/PageNotFound';
import Logout from './pages/Logout';

import PrivateRoute from './utils/PrivateRoute';
import { AuthContext } from "./utils/auth-context";
import { isAuthenticated } from "./utils";

function App() {

  const location = useLocation();

  useEffect(() => {
    AOS.init({
      once: true,
      disable: 'phone',
      duration: 700,
      easing: 'ease-out-cubic',
    });
    // eslint-disable-next-line no-unused-vars
    const sticky = new Sticky('[data-sticky]');
  });

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
    focusHandling('outline');
  }, [location.pathname]); // triggered on route change

  return (
    <AuthContext.Provider value={{ user: isAuthenticated() }}>
      <Switch>
        <Route exact path="/">
        <SignUp />
        </Route>
        <Route path="/signin">
          <SignIn />
        </Route>
        <Route path="/signup">
          <SignUp />
        </Route>
        <Route path="/logout">
          <Logout />
        </Route>
        {/*
        <Route path="/reset-password">
          <ResetPassword />
        </Route>*/}
        <Route path="*">
          <PageNotFound />
        </Route>
      </Switch>
    </AuthContext.Provider>
  );
}

export default App;
