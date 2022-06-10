import React from 'react';

import { CURRENT_USER_INFO_KEY } from 'src/constants/Auth';

import { ReactComponent as GoogleIcon } from 'src/assets/google_icon.svg';

interface Props {
  onYesClick: () => void;
  onNoClick: () => void;
}

function CalendarPopup({ onYesClick, onNoClick }: Props) {
  const userInfo = localStorage.getItem(CURRENT_USER_INFO_KEY);

  return (
    <div className={'calendar-popup'}>
      <div className={'description'}>
        <GoogleIcon className={'google-icon'} />
        {userInfo && JSON.parse(userInfo).userName}
        {'님의 '}
        <b>{'구글계정 일정'}</b>
        {'도 불러올까요?'}
        <br />
        {'미팅시간 결정에 도움이 될 거에요!'}
      </div>
      <div className={'popup-options'}>
        <span className={'no'} onClick={onNoClick}>
          {'다음에 할게요'}
        </span>
        <span className={'yes'} onClick={onYesClick}>
          {'좋아요'}
        </span>
      </div>
    </div>
  );
}

export default CalendarPopup;
