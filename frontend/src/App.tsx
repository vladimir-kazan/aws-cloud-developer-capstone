import React, { Fragment } from 'react';
import { AuthService } from './auth/auth';
import { Router, Switch, Route } from 'react-router-dom';

import { NavigationBar } from './components/NavigationBar';
import { HomePage } from './components/HomePage';
import { HelpPage } from './components/HelpPage';

interface Props {
  auth: AuthService;
  isAuthenticating?: boolean;
  history: any;
}

const App = (props: Props) => {
  return (
    <Fragment>
      <NavigationBar auth={props.auth} />
      <Router history={props.history}>
        <Switch>
          <Route path="/" exact component={HomePage}></Route>
          <Route path="/help" exact component={HelpPage}></Route>
        </Switch>
      </Router>
    </Fragment>
  );
};

export default App;
