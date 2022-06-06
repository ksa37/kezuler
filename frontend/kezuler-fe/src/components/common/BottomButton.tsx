import React from 'react';
import classNames from 'classnames';

import 'src/styles/components.scss';

interface Props {
  onClick?: () => void;
  text: string;
  subtext?: string;
  disabled?: boolean;
}

function BottomButton({ onClick, text, subtext, disabled }: Props) {
  return (
    <div
      className={classNames('bottom-button', {
        disabled: disabled,
      })}
      onClick={onClick}
    >
      <div className={'btn-text-area'}>
        {subtext && <div className={'btn-subtext'}>{subtext}</div>}
        <b className={classNames('btn-text', subtext ? 'sub-exist' : '')}>
          {text}
        </b>
      </div>
    </div>
  );
}

export default BottomButton;
