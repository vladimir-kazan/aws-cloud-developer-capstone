import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card, Colors } from '@blueprintjs/core';
import { Content } from './Content';
import { useApi, Note } from '../services/api.service';
import { ListToolbar } from './ListToolbar';
import { useParams, useHistory } from 'react-router-dom';
import { formatToShortDate } from '../utils/date';

const Container = styled.div`
  display: flex;
  height: 100vh;
  padding-top: 50px;
`;

const LeftPanel = styled.div`
  min-height: 100%;
  min-width: 330px;
`;

const RightPanel = styled.div`
  background: ${Colors.LIGHT_GRAY1};
  min-height: 100%;
  width: 100%;
`;

const StyledCard = styled(Card)<{ selected: boolean }>`
  color: ${Colors.LIGHT_GRAY5};

  &.bp3-card {
    background-color: ${({ selected }) => (selected ? Colors.DARK_GRAY3 : 'inherit')};
  }
  &:hover {
    background-color: ${Colors.DARK_GRAY4};
  }
  p:last-child {
    margin-bottom: 0;
  }
`;

const Title = styled.p`
  color: ${Colors.LIGHT_GRAY3};
`;

const Updated = styled.p`
  color: ${Colors.GRAY3};
`;

const NO_TITLE = 'Untitled Note';
const getNewNote = (): Note => {
  return {
    noteId: 'create',
    title: NO_TITLE,
    body: '',
    createdAt: '',
    updatedAt: '',
    updatedAtString: formatToShortDate(new Date()),
  };
};

export const HomePage = () => {
  const { noteId = '' } = useParams();
  const history = useHistory();
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note>();
  const [currentNoteTitle, setCurrentNoteTitle] = useState<string>('');
  const api = useApi();
  const [noteIsLoading, setNoteIsLoading] = useState<boolean>(true);
  const [sorting, setSorting] = useState<string>('-updated');

  useEffect(() => {
    (async () => {
      const items = await api.getNotes(sorting);
      setNotes(items);
    })();
  }, [api, history, sorting]);

  useEffect(() => {
    if (!noteId) {
      const [first = { noteId: '' }] = notes;
      history.replace(`/notes/${first?.noteId}`);
    }
  }, [notes, noteId, history]);

  useEffect(() => {
    setNoteIsLoading(true);
    if (noteId) {
      history.replace(`/notes/${noteId}`);
    }
  }, [noteId, history]);

  useEffect(() => {
    if (noteId === 'create') {
      setCurrentNote(getNewNote());
      setNoteIsLoading(false);
    } else {
      (async () => {
        const item = await api.getNoteById(noteId || '');
        setCurrentNote(item || getNewNote());
        setNoteIsLoading(false);
      })();
    }
  }, [noteId, api]);

  useEffect(() => {
    setCurrentNoteTitle(currentNote ? currentNote.title : NO_TITLE);
  }, [currentNote]);

  const onAddNew = () => {
    history.replace('/notes/create');
  };

  const onSelect = (id: string) => () => {
    history.replace(`/notes/${id}`);
  };

  const handleSortingChange = (sorting: string) => {
    setSorting(sorting);
  };

  const handleTitleChange = (newTitle: string) => {
    setCurrentNoteTitle(newTitle || NO_TITLE);
  };
  const handleSave = async (lastTitle: string, lastBody: string) => {
    if (noteId === 'create') {
      await api.createNote(lastTitle, lastBody);
    } else {
      console.log('handleSave', lastTitle, lastBody);
    }
    const items = await api.getNotes(sorting);
    setNotes(items);
    history.replace(`/notes`);
  };

  const handleCancel = () => {
    console.log('handleCancel');
  };

  return (
    <Container>
      <LeftPanel>
        <ListToolbar
          onAddNew={onAddNew}
          addDisabled={noteId === 'create'}
          onChangeSorting={handleSortingChange}
        />
        {noteId === 'create' && currentNote && (
          <StyledCard interactive={false} selected={true}>
            <Title>{currentNoteTitle || NO_TITLE}</Title>
            <Updated>{currentNote.updatedAtString}</Updated>
          </StyledCard>
        )}
        {notes.map((n: Note) => {
          return (
            <StyledCard
              key={n.noteId}
              interactive={true}
              selected={n.noteId === noteId}
              onClick={onSelect(n.noteId)}
            >
              <Title>{n.noteId === noteId ? currentNoteTitle : n.title}</Title>
              <Updated>{n.updatedAtString}</Updated>
            </StyledCard>
          );
        })}
      </LeftPanel>
      <RightPanel>
        {currentNote && (
          <Content
            loading={noteIsLoading}
            dirty={noteId === 'create'}
            title={currentNote.title}
            body={currentNote.body}
            onTitleChange={handleTitleChange}
            onSave={handleSave}
            onCancel={handleCancel}
          ></Content>
        )}
      </RightPanel>
    </Container>
  );
};
