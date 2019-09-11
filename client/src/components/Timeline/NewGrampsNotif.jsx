import React from 'react';
import { Chip } from '@material-ui/core';
import VerticalAlign from '@material-ui/icons/VerticalAlignTop';

export default function NewGrampsNotif({ show, ...props }) {
  return (
    <div className={!show ? 'hide-notification' : 'new-gramp-notification'}>
      <Chip
        label="New gramps!"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        color="primary"
        icon={<VerticalAlign />}
      />
    </div>
  );
}
