import React from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import { createBrowserHistory, LocationState } from 'history';
import { FocusStyleManager } from '@blueprintjs/core';

import { AuthService } from './services/auth.service';
import { HomePage } from './components/HomePage';
import { NavigationBar } from './components/NavigationBar';
import { HelpPage } from './components/HelpPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './components/LoginPage';
import { ApiService, ApiContext } from './services/api.service';

const history: any = createBrowserHistory<LocationState>();
const localStorageService: Storage = localStorage;
const authService = new AuthService(history, localStorageService);
const apiService = new ApiService(localStorageService, authService);
const handleAuthentication = (props: any) => {
  const location = props.location;
  if (/access_token|id_token|error/.test(location.hash)) {
    authService.handleAuthentication();
  }
};

FocusStyleManager.onlyShowFocusOnTabs();

const App = () => {
  return (
    <div className="bp3-dark">
      <ApiContext.Provider value={apiService}>
        <Router history={history}>
          <NavigationBar auth={authService} />
          <Switch>
            <ProtectedRoute path="/notes/:noteId?" auth={authService}>
              <HomePage />
            </ProtectedRoute>
            <Route path="/help" exact component={HelpPage}></Route>
            <Route
              path="/callback"
              render={(props) => {
                handleAuthentication(props);
                return <LoginPage auth={authService} callbackInProgress />;
              }}
            />
            <Route
              path="/"
              render={({ location }) => {
                if (authService.isAuthenticated()) {
                  return (
                    <Redirect
                      to={{
                        pathname: '/notes',
                        state: { from: location },
                      }}
                    />
                  );
                }
                return <LoginPage auth={authService} />;
              }}
            />
          </Switch>
        </Router>
      </ApiContext.Provider>
    </div>
  );
};

export default App;
