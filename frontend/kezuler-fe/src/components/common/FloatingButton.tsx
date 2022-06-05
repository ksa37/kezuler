import React from 'react';
import classNames from 'classnames';

import 'src/styles/common/FloatingButton.scss';

interface Props {
  className?: string;
  icon: JSX.Element;
  onClick: () => void;
  text?: string;
}

function FloatingButton({ className, icon, onClick, text }: Props) {
  return (
    <button
      className={classNames('floating-button', className)}
      onClick={onClick}
    >
      <div className={'floating-button-icon'}>{icon}</div>
      {text}
    </button>
  );
}

export default FloatingButton;
