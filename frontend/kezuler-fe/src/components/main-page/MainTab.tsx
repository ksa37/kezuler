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
    const appInner = document.getElementById('app-inner');

    if (element && appInner) {
      // pc view width: 800
      // pc view height: 767
      // main app bar: 72 / 56
      // main tab: 62 / 54
      // half of host badge: 10
      // buffer: 2
      // large: 72 + 62 + 10 + 2 = 146
      // small: 56 + 54 + 10 + 2 = 122
      // pc: large + pc top margin

      const { innerHeight, innerWidth } = window;

      let topOffset;
      // pc view 중 위 아래 마진이 있는 경우
      if (innerWidth > 800 && innerHeight > 767) {
        topOffset = (innerHeight - 767) / 2 + 146;
      } else if (innerHeight > 600) {
        topOffset = 146;
      } else {
        topOffset = 122;
      }

      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + appInner.scrollTop - topOffset;

      appInner.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
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
