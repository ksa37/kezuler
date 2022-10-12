import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';

import { GOOGLE_LOGIN_SCOPE } from 'src/constants/Auth';
import useGetUserInfo from 'src/hooks/useGetUserInfo';
import { usePatchUser } from 'src/hooks/usePatchUser';

import { getGoogleAccount } from 'src/api/calendar';

interface Props {
  setIsCalendarPaired: React.Dispatch<
    React.SetStateAction<boolean | undefined>
  >;
}

function CalendarPairBtn({ setIsCalendarPaired }: Props) {
  const { changeUser } = usePatchUser();
  const { getUserInfo } = useGetUserInfo();

  const handleGoogleSuccess = (res: any) => {
    changeUser(getGoogleAccount(res.code), {
      onSuccess: () => {
        getUserInfo();
        setIsCalendarPaired(true);
      },
    });
  };

  const handleGooglelogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    flow: 'auth-code',
    scope: GOOGLE_LOGIN_SCOPE,
  });

  return (
    <div className={'calendar-pair-ask'}>
      <div className={'calendar-pair-ask-txt'}>
        {'캘린더를 연동하여'}
        <br />
        {'이중약속을 방지해요!'}
      </div>
      <div className={'calendar-pair-ask-btn'} onClick={handleGooglelogin}>
        <div className={'btn-txt'}>나의 일정 </div>
        <div className={'btn-txt'}>불러오기</div>
      </div>
    </div>
  );
}

export default CalendarPairBtn;
