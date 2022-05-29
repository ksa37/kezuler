import React from 'react';
import classNames from 'classnames';

import 'src/styles/components.scss';

interface Props {
  onClick: () => void;
  text: string;
  mainColored?: boolean;
}

function TextAppBar({ onClick, text, mainColored }: Props) {
  return (
    <div
      className={classNames('text-app-bar', {
        'main-colored': mainColored,
      })}
      onClick={onClick}
    >
      <div className={'text-app-bar-content'}>
        <div className={'text-app-bar-content-bbtn'}></div>
        <div className={'text-app-bar-content-text'}>{text}</div>
      </div>
    </div>
  );
}

export default TextAppBar;
