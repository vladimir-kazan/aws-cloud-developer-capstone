import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { ControlGroup, Button, Colors } from '@blueprintjs/core';

const Container = styled.div`
  display: flex;
  height: 30px;
  justify-content: space-between;
  padding: 0 0 0 16px;
  background-color: ${Colors.DARK_GRAY5};
  box-shadow: 0 0 0 1px rgba(16, 22, 26, 0.4);
`;

interface Props {
  dirty: boolean;
  saveDisabled?: boolean;
  onSaveClick: () => void;
  onCancelClick: () => void;
}

export const ContentToolbar: FunctionComponent<Props> = ({
  dirty,
  onCancelClick,
  onSaveClick,
  saveDisabled,
}) => {
  return (
    <Container>
      <ControlGroup />
      {dirty && (
        <ControlGroup>
          <Button icon="undo" text="Cancel" onClick={onCancelClick} />
          <Button
            icon="floppy-disk"
            text="Save"
            intent="success"
            onClick={onSaveClick}
            disabled={!!saveDisabled}
          />
        </ControlGroup>
      )}
    </Container>
  );
};
