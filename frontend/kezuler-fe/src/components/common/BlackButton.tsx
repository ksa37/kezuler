import React from 'react';

interface Props {
  onClick: () => void;
  text: string;
}

function BlackButton({ onClick, text }: Props) {
  return (
    <button className="black-button" onClick={onClick}>
      {text}
    </button>
  );
}

export default BlackButton;
