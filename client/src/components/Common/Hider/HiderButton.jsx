import React from 'react';
import { Button } from '@material-ui/core';

export default function HiderButton({ onClick, name, index, currentElement }) {
  const selected = index === currentElement;
  const variant = selected ? 'contained' : 'outlined';
  return (
    <div className="">
      <Button onClick={onClick} variant={variant} size="medium" color="primary">
        {name}
      </Button>
    </div>
  );
}
