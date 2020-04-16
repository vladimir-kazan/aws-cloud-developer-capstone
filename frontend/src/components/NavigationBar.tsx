import React from 'react';
import {
  Alignment,
  Button,
  Classes,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
} from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { AuthService } from '../services/auth';

interface Props {
  auth: AuthService;
}

export const NavigationBar = (props: Props) => {
  const history = useHistory();
  const navigate = (path: string) => () => {
    history.push(path);
  };
  return (
    <Navbar fixedToTop>
      <NavbarGroup align={Alignment.LEFT}>
        <NavbarHeading>Markdown Notebook</NavbarHeading>
        <NavbarDivider />
        <Button className={Classes.MINIMAL} icon="home" text="Home" onClick={navigate('/notes')} />
        <Button className={Classes.MINIMAL} icon="help" text="Help" onClick={navigate('/help')} />
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        <NavbarDivider />
        {props.auth.isAuthenticated() ? (
          <Button
            className={Classes.MINIMAL}
            icon="user"
            text="Logout"
            onClick={props.auth.logout}
          />
        ) : (
          <Button className={Classes.MINIMAL} icon="user" text="Login" onClick={props.auth.login} />
        )}
      </NavbarGroup>
    </Navbar>
  );
};
