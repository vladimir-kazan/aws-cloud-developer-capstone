import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card, Colors } from '@blueprintjs/core';
import { backendConfig } from '../config';
import { formatToShortDate } from '../utils/date';
import { Content } from './Content';

const Container = styled.div`
  display: flex;
`;

const LeftPanel = styled.div`
  min-height: 100vh;
  min-width: 330px;
`;

const RightPanel = styled.div`
  background: ${Colors.LIGHT_GRAY1};
  min-height: 100vh;
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

interface Note {
  noteId: string;
  userId: string;
  title: string;
  body: string;
  updatedAt: string;
  createdAt: string;
  [k: string]: any;
}

const notesUrl = `${backendConfig.api}/notes`;
export const HomePage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selected, setSelected] = useState<Note | null>(null);
  useEffect(() => {
    (async () => {
      let items: Note[] = await (await fetch(notesUrl)).json();
      items = items.map((n) => {
        n.updatedAtString = formatToShortDate(new Date(n.updatedAt));
        return n;
      });
      const [first = null] = items;
      setNotes(items);
      setSelected(first);
    })();
  }, []);
  const { noteId: selectedId = '' } = selected || {};
  return (
    <Container>
      <LeftPanel>
        {notes.map((n: Note) => {
          return (
            <StyledCard
              key={n.noteId}
              interactive={true}
              selected={n.noteId === selectedId}
              onClick={() => setSelected(n)}
            >
              <Title>{n.title}</Title>
              <Updated>{n.updatedAtString}</Updated>
            </StyledCard>
          );
        })}
      </LeftPanel>
      <RightPanel>
        <Content noteId={selectedId}></Content>
      </RightPanel>
    </Container>
  );
};
