import React, { useEffect, useState, useCallback } from 'react';
import {
  Alignment,
  Button,
  Classes,
  Navbar,
  NavbarDivider,
  NavbarHeading,
  MenuItem,
} from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import { Suggest, IItemRendererProps } from '@blueprintjs/select';
import { AuthService } from '../services/auth.service';
import { Note } from '../services/api.service';

const NoteSuggest = Suggest.ofType<Note>();

interface Props {
  auth: AuthService;
}

export const NavigationBar = (props: Props) => {
  const history = useHistory();
  const navigate = (path: string) => () => {
    history.push(path);
  };
  const [query, setQuery] = useState<string>('');
  const note: Note = {
    noteId: 'noteId',
    // userId?: string;
    title: 'title',
    body: 'body',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
  };

  useEffect(() => {
    console.log({ query });
  }, [query]);

  const itemRenderer = (item: Note, props: IItemRendererProps) => {
    return <MenuItem key={item.noteId} onClick={props.handleClick} text={item.title} />;
  };

  const onQueryChange = useCallback((nextQuery: string) => {
    setQuery(nextQuery);
  }, []);

  return (
    <Navbar fixedToTop>
      <Navbar.Group align={Alignment.LEFT}>
        <NavbarHeading>Markdown Notebook</NavbarHeading>
        <NavbarDivider />
        <Button className={Classes.MINIMAL} icon="home" text="Home" onClick={navigate('/notes')} />
        <Button className={Classes.MINIMAL} icon="help" text="Help" onClick={navigate('/help')} />
        <Navbar.Divider />
        <NoteSuggest
          items={[note]}
          itemsEqual="noteId"
          inputValueRenderer={(item: Note) => item.title}
          itemRenderer={itemRenderer}
          onQueryChange={onQueryChange}
          onItemSelect={(item: Note, e: any) => {
            console.log({ item, e });
          }}
        />
      </Navbar.Group>
      <Navbar.Group align={Alignment.RIGHT}>
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
      </Navbar.Group>
    </Navbar>
  );
};
