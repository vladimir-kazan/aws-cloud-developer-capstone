import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card, Button } from '@blueprintjs/core';

const Container = styled.div`
  display: flex;
`;

const LeftPanel = styled.div`
  min-height: 100vh;
  min-width: 330px;
`;

const RightPanel = styled.div`
  background: grey;
  min-height: 100vh;
  width: 100%;
`;

interface Note {
  id: string;
  title: string;
  content: string;
}

export const HomePage = () => {

  const [notes, setNotes] = useState<Note[]>([]);
  const [selected, setSelected] = useState<Note|null>(null);
  useEffect(() => {
    console.log('load once');

    (async () => {
      console.log(await fetch('example.com'));
      setNotes([]);
      setSelected(null);
    })();
  }, []);

  return (
    <Container>
      <LeftPanel>
        {notes.map((n) => (
          <Card interactive={true}>
              {/* <h5><a href="#">Card heading</a></h5> */}
              <p>Card content</p>
              <Button>Submit</Button>
          </Card>
        ))}

      </LeftPanel>
      <RightPanel>
        Content {selected}
      </RightPanel>
    </Container>
  );
};
