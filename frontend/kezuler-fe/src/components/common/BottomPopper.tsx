import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import classNames from 'classnames';

import { ReactComponent as CloseIcon } from 'src/assets/icn_close_b.svg';
import 'src/styles/common/BottomPopper.scss';

interface Props {
  title: string;
  description?: string;
  buttonText: string;
  onClick: () => void;
  onDisableClick?: () => void;
  image: string;
  isSmallTitle?: boolean;
  disableDelete?: boolean;
  reverseOrder?: boolean;
  btnStartIcon?: React.ReactElement;
  notFixed?: boolean;
}

// 버튼이 있는, 화면 하단부에 나타는 팝업
function BottomPopper({
  title,
  description,
  buttonText,
  onClick,
  onDisableClick,
  image,
  isSmallTitle,
  disableDelete = false,
  reverseOrder = false,
  btnStartIcon,
  notFixed,
}: Props) {
  const [isOpen, setIsOpen] = useState(true);

  const handleCloseClick = () => {
    onDisableClick && onDisableClick();
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }
  return (
    <div
      className={classNames('bottom-popper', { 'not-fixed': notFixed })}
      // style={{
      //   backgroundImage: `linear-gradient(#fad94f, #fad94f33), url(${image})`
      // }}
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
      <div
        style={{
          position: 'absolute',
          bottom: '0',
          height: '100%',
          width: '100%',
          content: '',
          borderTopLeftRadius: '74px',
          backgroundImage: `linear-gradient(#fad94f, #fad94f33), url(${image})`,
          opacity: '0.8',
        }}
      ></div>
    </div>
  );
}

export default BottomPopper;
