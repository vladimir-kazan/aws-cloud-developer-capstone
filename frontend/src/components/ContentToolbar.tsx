import React from 'react';
import styled from 'styled-components';
import { ControlGroup } from '@blueprintjs/core';

const Container = styled.div`
  display: flex;
  height: 30px;
  padding: 0 15px;
`;

export const ContentToolbar = () => {
  return (
    <Container>
      <ControlGroup>Created: ------ Updated: -------</ControlGroup>
    </Container>
  );
};
