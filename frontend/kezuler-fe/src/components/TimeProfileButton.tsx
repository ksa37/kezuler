import React from 'react';

interface Props {
  onClick: () => void;
  time: object;
  voterList?: object;
}

function TimeProfileButton({ onClick, time, voterList }: Props) {
  return (
    <button className="black-button" onClick={onClick}>
      <img src={startIcon} alt="1" />
      {title}
    </button>
  );
}

export default TimeProfileButton;
