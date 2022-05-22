import React from 'react';

interface Props {
  icon: JSX.Element;
  onClick: () => void;
  text?: string;
  noti?: string;
}

function FloatingButton({ icon, onClick, text, noti }: Props) {
  return (
    <button className="icon-button" onClick={onClick}>
      {text}
      <div>
        {noti && <span>{noti}</span>}
        {icon}
      </div>
    </button>
  );
}

export default FloatingButton;
