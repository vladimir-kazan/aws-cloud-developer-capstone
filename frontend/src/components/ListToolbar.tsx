import React, { useState, FunctionComponent, ChangeEvent } from 'react';
import { ControlGroup, HTMLSelect, Button, IOptionProps } from '@blueprintjs/core';

const FILTER_OPTIONS: IOptionProps[] = [
  { label: 'Title - ascending', value: 'title' },
  { label: 'Title - descending', value: '-title' },
  { label: 'Updated - ascending', value: 'updated' },
  { label: 'Updated - descending', value: '-updated' },
];

interface Props {
  onAddNew: () => void;
  addDisabled: boolean;
  onChangeSorting: (sorting: string) => void;
}

export const ListToolbar: FunctionComponent<Props> = ({
  onAddNew,
  addDisabled,
  onChangeSorting,
}) => {
  const [sorting, setSorting] = useState<string>(`${FILTER_OPTIONS[3].value}`);
  const handleSorting = (e: ChangeEvent<HTMLSelectElement>) => {
    setSorting(e.target.value);
    onChangeSorting(e.target.value);
  };
  return (
    <ControlGroup fill>
      <HTMLSelect options={FILTER_OPTIONS} value={sorting} onChange={handleSorting} />
      <Button icon="add" text="Add" intent="success" onClick={onAddNew} disabled={addDisabled} />
    </ControlGroup>
  );
};
