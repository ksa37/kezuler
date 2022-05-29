import React from 'react';
import classNames from 'classnames';

interface Props {
  className?: string;
  icon: JSX.Element;
  onClick: () => void;
  text?: string;
}

function FloatingButton({ className, icon, onClick, text }: Props) {
  return (
    <button className={classNames('icon-button', className)} onClick={onClick}>
      {icon}
      {text}
    </button>
  );
}

export default FloatingButton;
