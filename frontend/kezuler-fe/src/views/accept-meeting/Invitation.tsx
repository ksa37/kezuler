import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { ACCESS_TOKEN_KEY } from 'src/constants/Auth';
import { RootState } from 'src/reducers';
import { acceptMeetingActions } from 'src/reducers/AcceptMeeting';
import { AppDispatch } from 'src/store';
import { getCookie } from 'src/utils/cookie';

import BottomPopper from 'src/components/common/BottomPopper';

import popupBgInvite from 'src/assets/popup_bg_invitation.svg';

function Invitation() {
  const dispatch = useDispatch<AppDispatch>();
  const { pendingEvent } = useSelector(
    (state: RootState) => state.acceptMeeting
  );
  const { eventHost, eventTitle, eventZoomAddress, eventPlace } = pendingEvent;
  const { increaseStep } = acceptMeetingActions;

  const handleNextClick = () => {
    dispatch(increaseStep());
  };

  const handleConnectClick = () => {
    //TODO: 카카오 로그인
    dispatch(increaseStep());
    console.log('next!');
  };
  // const isLoggedIn = true;
  const isLoggedIn = useMemo(() => !!getCookie(ACCESS_TOKEN_KEY), []);
  // const inviteDescription = '님이 미팅에 초대합니다.';
  //TODO: 정보 가져오기
  const hostName = eventHost.userName;
  const meetingTitleDescription = '미팅 제목';
  const meetingPlaceDescription = '미팅 장소';
  const timeSelectDescription = '참여 가능한 시간을 알려주세요';
  const loginButtonText = '시간 선택하기';
  const unloginButtonText = '카카오로 계속하기';

  return (
    <div className={'invitation'}>
      <div className={'invitation-info'}>
        <div className={'invitation-message'}>
          <b>{hostName}</b>
          {'님이 '}
          <br />
          {'미팅에 초대합니다.'}
        </div>
        <img
          className={'invitation-avatar'}
          alt=""
          src={eventHost.userProfileImage}
        />
        <div className={'invitation-card'}>
          <div className={'invitation-title-place'}>
            {meetingTitleDescription}
          </div>
          <div className={'invitation-title-text'}>{eventTitle}</div>
          <div className={classNames('invitation-title-place', 'place')}>
            {meetingPlaceDescription}
          </div>
          <div className={'invitation-place-text'}>
            {eventZoomAddress || eventPlace}
          </div>
        </div>
      </div>
      <div>
        <BottomPopper
          title={timeSelectDescription}
          buttonText={isLoggedIn ? loginButtonText : unloginButtonText}
          onClick={isLoggedIn ? handleNextClick : handleConnectClick}
          image={popupBgInvite}
        />
      </div>
    </div>
  );
}

export default Invitation;
