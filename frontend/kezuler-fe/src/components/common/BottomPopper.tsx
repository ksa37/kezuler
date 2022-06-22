import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import classNames from 'classnames';

import { ReactComponent as CloseIcon } from 'src/assets/icn_close_b.svg';
import 'src/styles/common/BottomPopper.scss';

interface Props {
  title: string;
  description?: string;
  buttonText: string;
  onClick: () => void;
  image: string;
  isSmallTitle?: boolean;
  disableDelete?: boolean;
  reverseOrder?: boolean;
  btnStartIcon?: React.ReactElement;
}

// 버튼이 있는, 화면 하단부에 나타는 팝업
function BottomPopper({
  title,
  description,
  buttonText,
  onClick,
  image,
  isSmallTitle,
  disableDelete = false,
  reverseOrder = false,
  btnStartIcon,
}: Props) {
  const [isOpen, setIsOpen] = useState(true);

  const handleCloseClick = () => {
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }
  return (
    <div
      className={'bottom-popper'}
      style={{
        backgroundImage: `linear-gradient(#fad94f, #fad94f33), url(${image})`,
      }}
    >
      {disableDelete ? (
        <div
          className={classNames('close-button-container', {
            'disable-delete': disableDelete,
          })}
        ></div>
      ) : (
        <div className={'close-button-container'}>
          <IconButton onClick={handleCloseClick}>
            <CloseIcon />
          </IconButton>
        </div>
      )}
      {reverseOrder ? (
        <>
          <h2 className={'is-reverse'}>{description}</h2>
          <h1
            className={classNames('is-reverse', {
              'small-title': isSmallTitle,
            })}
          >
            {title}
          </h1>
        </>
      ) : (
        <>
          <h1
            className={classNames({
              'small-title': isSmallTitle,
            })}
          >
            {title}
          </h1>
          <h2>{description}</h2>
        </>
      )}
      <button onClick={onClick}>
        {btnStartIcon}
        {buttonText}
      </button>
    </div>
  );
}

export default BottomPopper;
