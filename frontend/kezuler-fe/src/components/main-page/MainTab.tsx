import React from 'react';
import { IconButton } from '@mui/material';
import classNames from 'classnames';

import { FIXED_TODAY_ID } from 'src/constants/Main';

import { ReactComponent as TodayIcon } from 'src/assets/icn_today.svg';

interface Props {
  isFixedMeeting: boolean;
  setIsFixedMeeting: React.Dispatch<React.SetStateAction<boolean>>;
}

function MainTab({ isFixedMeeting, setIsFixedMeeting }: Props) {
  const handleFixedClick = () => {
    setIsFixedMeeting(true);
  };

  const handlePendingClick = () => {
    setIsFixedMeeting(false);
  };

  const handleTodayClick = () => {
    const element = document.getElementById(FIXED_TODAY_ID);
    element?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  };

  return (
    <div className={classNames('common-tab', 'main-tab')}>
      <div>
        <button
          className={classNames('common-tab-button', 'left', {
            selected: isFixedMeeting,
          })}
          onClick={handleFixedClick}
        >
          다가오는 미팅
        </button>
        <button
          className={classNames('common-tab-button', 'right', {
            selected: !isFixedMeeting,
          })}
          onClick={handlePendingClick}
        >
          대기중인 미팅
        </button>
      </div>
      {isFixedMeeting && (
        <IconButton className={'main-tab-today'} onClick={handleTodayClick}>
          <TodayIcon />
        </IconButton>
      )}
    </div>
  );
}

export default MainTab;
