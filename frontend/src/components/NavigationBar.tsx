import React from 'react';
import {
  Alignment,
  Button,
  Classes,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
} from "@blueprintjs/core";
import { useHistory } from 'react-router-dom';

export const NavigationBar = () => {
  console.count('NavigationBar');
  const history = useHistory();
  const navigate = (path: string) => () => {
    history.push(path);
  };
  return (
    <Navbar>
      <NavbarGroup align={Alignment.LEFT}>
          <NavbarHeading>Markdown Notebook</NavbarHeading>
          <NavbarDivider />
          <Button className={Classes.MINIMAL} icon="home" text="Home" onClick={navigate('/')} />
          <Button className={Classes.MINIMAL} icon="help" text="Help" onClick={navigate('/help')}/>
      </NavbarGroup>
    </Navbar>
  );
};
