import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card, Colors } from '@blueprintjs/core';
import { Content } from './Content';
import { useApi, Note } from '../services/api.service';
import { ListToolbar } from './ListToolbar';

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

export const HomePage = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selected, setSelected] = useState<Note | null>(null);
  const api = useApi();

  useEffect(() => {
    (async () => {
      const items = await api.getNotes();
      const [first = null] = items;
      setNotes(items);
      setSelected(first);
    })();
  }, [api]);
  const { noteId: selectedId = '' } = selected || {};
  return (
    <Container>
      <LeftPanel>
        <ListToolbar />
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
