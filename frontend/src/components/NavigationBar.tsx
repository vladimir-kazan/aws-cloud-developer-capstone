import React, { useEffect, useState, useCallback, useRef } from 'react';
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
import { debounce } from 'throttle-debounce';
import { AuthService } from '../services/auth.service';
import { Note, useApi } from '../services/api.service';

const NoteSuggest = Suggest.ofType<Note>();

interface Props {
  auth: AuthService;
}

export const NavigationBar = (props: Props) => {
  const history = useHistory();
  const api = useApi();
  const navigate = (path: string) => () => {
    history.push(path);
  };
  const [query, setQuery] = useState<string>('');
  const [suggestedNotes, setSuggestedNotes] = useState<Note[]>([]);
  const search = useRef(
    debounce(400, (query: string) => {
      if (!query) {
        setSuggestedNotes([]);
        return;
      }
      (async () => {
        const suggestions = await api.searchNotes(query);
        setSuggestedNotes(suggestions);
      })();
    }),
  );

  useEffect(() => {
    search.current(query);
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
          items={suggestedNotes}
          itemsEqual="noteId"
          query={query}
          inputValueRenderer={(item: Note) => query && item.title}
          itemRenderer={itemRenderer}
          onQueryChange={onQueryChange}
          onItemSelect={(item: Note) => {
            setQuery('');
            navigate(`/notes/${item.noteId}`)();
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
