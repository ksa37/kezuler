import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import classNames from 'classnames';

import { FIXED_TODAY_ID } from 'src/constants/Main';
import PathName from 'src/constants/PathName';

import { ReactComponent as TodayIcon } from 'src/assets/icn_today.svg';

function MainTab() {
  const navigate = useNavigate();
  const location = useLocation();
  const isFixedMeeting = location.pathname.startsWith(PathName.mainFixed);

  const handleFixedClick = () => {
    navigate(PathName.mainFixed, { replace: true });
  };

  const handlePendingClick = () => {
    navigate(PathName.mainPending, { replace: true });
  };

  const handleTodayClick = () => {
    const element = document.getElementById(FIXED_TODAY_ID);
    element?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  };

  return (
    <div className={classNames('common-tab', 'main-tab')}>
      <div className={'common-tab-buttons-wrapper'}>
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
          투표중
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
