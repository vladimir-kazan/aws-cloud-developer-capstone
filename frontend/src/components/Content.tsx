import React, { useState, useEffect, Fragment } from 'react';
import { Spinner, Colors } from '@blueprintjs/core';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const PreviewContainer = styled.div`
  color: ${Colors.DARK_GRAY5};
  padding: 15px;
`;

interface Props {
  noteId: string;
}

export const Content = ({ noteId }: Props) => {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(false);
  }, [noteId]);

  return (
    <Fragment>
      {loading && <LoadingContainer><Spinner /></LoadingContainer>}
      {!loading && <PreviewContainer><ReactMarkdown source={noteId} /></PreviewContainer>}
    </Fragment>
  );
};
