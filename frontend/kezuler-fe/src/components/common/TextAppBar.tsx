import React from 'react';
import classNames from 'classnames';

import { ReactComponent as BackIcon } from 'src/assets/left_arrow.svg';
import 'src/styles/components.scss';

interface Props {
  onClick?: () => void;
  text: string;
  mainColored?: boolean;
}

function TextAppBar({ onClick, text, mainColored }: Props) {
  return (
    <div
      className={classNames('text-app-bar', {
        'main-colored': mainColored,
      })}
    >
      <div className={'text-app-bar-content'}>
        {onClick && (
          <BackIcon className={'text-app-bar-content-bbtn'} onClick={onClick} />
        )}
        <div className={'text-app-bar-content-text'}>{text}</div>
      </div>
    </div>
  );
}

export default TextAppBar;
