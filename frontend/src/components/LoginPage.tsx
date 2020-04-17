import React, { FunctionComponent } from 'react';
import { NonIdealState, Button } from '@blueprintjs/core';
import { AuthService } from '../services/auth.service';
import styled from 'styled-components';

const Container = styled.div`
  padding-top: 100px;
`;

interface Props {
  auth: AuthService;
  callbackInProgress?: boolean;
}

const icon = 'user';
const title = 'Log in';

export const LoginPage: FunctionComponent<Props> = ({ auth, callbackInProgress }) => {
  const action = callbackInProgress ? undefined : (
    <Button icon="log-in" onClick={() => auth.login()} text="Login" large intent="primary" />
  );
  const description = callbackInProgress
    ? 'Redirecting to notes...'
    : 'Please, log in to start working with notes';
  return (
    <Container>
      <NonIdealState icon={icon} title={title} description={description} action={action} />
    </Container>
  );
};
