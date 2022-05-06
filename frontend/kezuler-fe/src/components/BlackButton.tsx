import React from 'react';

interface Props {
  onClick: () => void;
  title: string;
  startIcon?: string;
}

function BlackButton({ onClick, title, startIcon }: Props) {
  return (
    <button className="black-button" onClick={onClick}>
      <img src={startIcon} alt="1" />
      {title}
    </button>
  );
}

{
  /* <BlackButton onClick={console.log} title="hello" />; */
}

export default BlackButton;
