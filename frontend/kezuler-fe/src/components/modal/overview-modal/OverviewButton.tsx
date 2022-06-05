import React from 'react';

interface Props {
  icon: JSX.Element;
  onClick: () => void;
  text?: string;
}

function OverviewButton({ icon, onClick, text }: Props) {
  return (
    <button className={'overview-btn'} onClick={onClick}>
      <div className={'overview-btn-icon'}>{icon}</div>
      {text}
    </button>
  );
}

export default OverviewButton;
