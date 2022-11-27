import React from 'react';

import useGoogleConnect from '../../hooks/useGoogleConnect';

import { ReactComponent as GoogleIcon } from 'src/assets/google_icon.svg';

interface Props {
  setIsCalendarPaired: React.Dispatch<
    React.SetStateAction<boolean | undefined>
  >;
}

function CalendarPairBtn({ setIsCalendarPaired }: Props) {
  const { handleGooglelogin } = useGoogleConnect({
    onSuccess: () => {
      setIsCalendarPaired(true);
    },
  });

  return (
    <div className={'calendar-pair-ask'}>
      <div className={'calendar-pair-ask-txt'}>
        {'캘린더를 연동하여'}
        <br />
        <b>{'이중약속을 방지'}</b>
        {'해요!'}
      </div>
      <div className={'calendar-pair-ask-btn'} onClick={handleGooglelogin}>
        <GoogleIcon />
        <span className={'btn-txt'}>일정 불러오기</span>
      </div>
    </div>
  );
}

export default CalendarPairBtn;
