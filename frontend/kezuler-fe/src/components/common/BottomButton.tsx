import React from 'react';
import classNames from 'classnames';

import 'src/styles/components.scss';

interface Props {
  type?: 'button' | 'submit';
  onClick?: () => void;
  text: string;
  subtext?: string;
  disabled?: boolean;
}

function BottomButton({
  type = 'button',
  onClick,
  text,
  subtext,
  disabled,
}: Props) {
  return (
    <button
      type={type}
      className={classNames('bottom-button', {
        disabled: disabled,
        'sub-exist': subtext,
      })}
      onClick={onClick}
    >
      <div className={'btn-text-area'}>
        {subtext && <div className={'btn-subtext'}>{subtext}</div>}
        <div className={'btn-text'}>
          <b>{text}</b>
        </div>
      </div>
    </button>
  );
}

export default BottomButton;
