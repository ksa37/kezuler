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
      className={classNames(
        'bottom-button',
        {
          disabled: disabled,
        },
        subtext ? 'sub-exist' : ''
      )}
      onClick={!disabled ? onClick : undefined}
    >
      <div className={classNames('btn-text-area', subtext ? 'sub-exist' : '')}>
        {subtext && <div className={'btn-subtext'}>{subtext}</div>}
        <div className={classNames('btn-text', subtext ? 'sub-exist' : '')}>
          <b>{text}</b>
        </div>
      </div>
    </div>
  );
}

export default BottomButton;
