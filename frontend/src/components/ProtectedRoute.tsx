import React, { FunctionComponent } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { AuthService } from '../services/auth.service';

interface Props extends RouteProps {
  auth: AuthService;
}

export const ProtectedRoute: FunctionComponent<Props> = ({ children, auth, ...rest }) => {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.isAuthenticated() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};
