import React, { useState } from 'react';
import { ControlGroup, HTMLSelect, Button } from '@blueprintjs/core';

const FILTER_OPTIONS = [
  'Name - ascending',
  'Name - descending',
  'Updated - ascending',
  'Updated - descending',
];

export const ListToolbar = () => {
  const [sorting, setSorting] = useState<string>(FILTER_OPTIONS[0]);
  return (
    <ControlGroup fill>
      <HTMLSelect
        options={FILTER_OPTIONS}
        value={sorting}
        onChange={(e) => setSorting(e.target.value)}
      />
      <Button icon="add" text="Add" intent="success" />
    </ControlGroup>
  );
};
