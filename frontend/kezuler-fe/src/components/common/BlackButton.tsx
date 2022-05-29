import React from 'react';
// import { Button } from '@mui/material';

interface Props {
  onClick: () => void;
  text: string;
}

function BlackButton({ onClick, text }: Props) {
  return (
    <div className="black-button" onClick={onClick}>
      {text}
    </div>
  );
}

export default BlackButton;
