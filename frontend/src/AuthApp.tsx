import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory, LocationState } from 'history';
import { FocusStyleManager } from '@blueprintjs/core';

import { AuthService } from './auth/auth';
import App from './App';
import { Callback } from './components/Callback';

const history: any = createBrowserHistory<LocationState>();
const localStorageService: Storage = localStorage;
const authService = new AuthService(history, localStorageService);
const handleAuthentication = (props: any) => {
  const location = props.location;
  if (/access_token|id_token|error/.test(location.hash)) {
    authService.handleAuthentication();
  }
};

FocusStyleManager.onlyShowFocusOnTabs();

const AuthApp = () => {
  return (
    <div className="bp3-dark">
      <Router history={history}>
        <Switch>
          <Route
            path="/callback"
            render={(props) => {
              handleAuthentication(props);
              return <Callback />;
            }}
          />
          <Route path="/"
            render={props => {
              console.log('render app');
              return <App auth={authService} {...props} />
            }}
          />
        </Switch>
      </Router>
    </div>
  );
};

export default AuthApp;
