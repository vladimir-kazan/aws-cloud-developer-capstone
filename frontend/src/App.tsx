import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { NavigationBar } from './components/NavigationBar';
import { HelpPage } from './components/HelpPage';
import { HomePage } from './components/HomePage';

const App = () => {
  return (
    <div className="bp3-dark">
      <Router>
        <NavigationBar />
        <Switch>
          <Route path="/help">
            <HelpPage />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
