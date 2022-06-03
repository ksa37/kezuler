import React from 'react';
import classNames from 'classnames';

import 'src/styles/components.scss';

interface Props {
  onClick?: () => void;
  text: string;
  disabled?: boolean;
}

function BottomButton({ onClick, text, disabled }: Props) {
  return (
    <div
      className={classNames('bottom-button', {
        disabled: disabled,
      })}
      onClick={onClick}
    >
      <b>{text}</b>
    </div>
  );
}

export default BottomButton;
