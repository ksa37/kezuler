import React, { useState } from 'react';
import { IconButton } from '@mui/material';

import 'src/styles/common/BottomPopper.scss';

interface Props {
  title: string;
  description?: string;
  buttonText: string;
  onClick: () => void;
  image: string;
}

// 버튼이 있는, 화면 하단부에 나타는 팝업
function BottomPopper({
  title,
  description,
  buttonText,
  onClick,
  image,
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
      <div className={'close-button-container'}>
        <IconButton onClick={handleCloseClick}>x</IconButton>
      </div>
      <h1>{title}</h1>
      <h2>{description}</h2>
      <button onClick={onClick}>{buttonText}</button>
    </div>
  );
}

export default BottomPopper;
