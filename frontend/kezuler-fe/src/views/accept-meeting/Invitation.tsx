import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import {
  ACCESS_TOKEN_KEY,
  KAKAO_AUTH_URL,
  LOGIN_REDIRECT_KEY,
} from 'src/constants/Auth';
import PathName from 'src/constants/PathName';
import { RootState } from 'src/reducers';
import { acceptMeetingActions } from 'src/reducers/AcceptMeeting';
import { dialogAction } from 'src/reducers/dialog';
import { AppDispatch } from 'src/store';
import { getCookie } from 'src/utils/cookie';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';
import { isModification } from 'src/utils/joinMeeting';

import BottomPopper from 'src/components/common/BottomPopper';

import { ReactComponent as LocIcon } from 'src/assets/icn_location_y.svg';
import { ReactComponent as PCIcon } from 'src/assets/icn_pc_y.svg';
import KakaoIcon from 'src/assets/img_kakao.svg';
import popupBgInvite from 'src/assets/popup_bg_invitation.svg';

function Invitation() {
  const dispatch = useDispatch<AppDispatch>();
  const { pendingEvent } = useSelector(
    (state: RootState) => state.acceptMeeting
  );
  const { show } = dialogAction;
  // const dispatch = useDispatch();
  const {
    eventId,
    eventHost,
    eventTitle,
    eventPlace,
    eventTimeCandidates,
    declinedUsers,
  } = pendingEvent;
  const { increaseStep } = acceptMeetingActions;

  const navigate = useNavigate();

  const isLoggedIn = useMemo(() => !!getCookie(ACCESS_TOKEN_KEY), []);

  const isHost = useMemo(
    () => eventHost.userId === getCurrentUserInfo()?.userId,
    [eventHost.userId]
  );

  const handleNextClick = () => {
    if (isHost) {
      dispatch(
        show({
          title: '참여오류',
          description: '해당 미팅의 호스트입니다.',
        })
      );
      navigate(`${PathName.main}`);
    } else if (isModification(eventTimeCandidates, declinedUsers)) {
      navigate(`${PathName.modify}/${eventId}`);
    } else {
      dispatch(increaseStep());
    }
  };

  const handleConnectClick = () => {
    location.href = KAKAO_AUTH_URL;
    sessionStorage.setItem(LOGIN_REDIRECT_KEY, `${PathName.invite}/${eventId}`);
  };

  const meetingTitleDescription = '미팅 제목';
  const meetingPlaceDescription = '미팅 장소';
  const timeSelectDescription = '참여 가능한 시간을 알려주세요';
  const loginButtonText = '시간 선택하기';
  const unloginButtonText = '카카오로 계속하기';

  return (
    <div className={'invitation'}>
      <div className={'invitation-info'}>
        <div className={'invitation-message'}>
          <b>{eventHost.userName}</b>
          {'님이 '}
          <br />
          {'미팅에 초대합니다.'}
        </div>

        <div className={'invitation-card'}>
          {/* <img
            className={'invitation-avatar'}
            alt=""
            src={eventHost.userProfileImage}
          /> */}
          <img
            className={'invitation-avatar'}
            alt=""
            src={
              'https://i.ibb.co/xqPTzqX/moon-transparent-png-full-moon-11562897860tahg4ponos.png'
            }
          />
          <div className={'invitation-title-place'}>
            {meetingTitleDescription}
          </div>
          <div className={'invitation-title-text'}>{eventTitle}</div>
          <div className={classNames('invitation-title-place', 'place')}>
            {meetingPlaceDescription}
          </div>
          <div className={'invitation-place'}>
            {eventPlace ? <LocIcon /> : <PCIcon />}
            <div className={'invitation-place-text'}>
              {eventPlace || '온라인'}
            </div>
          </div>
        </div>
      </div>
      <div>
        <BottomPopper
          title={timeSelectDescription}
          buttonText={isLoggedIn ? loginButtonText : unloginButtonText}
          onClick={isLoggedIn ? handleNextClick : handleConnectClick}
          image={popupBgInvite}
          isSmallTitle
          disableDelete
          btnStartIcon={
            !isLoggedIn ? (
              <img src={KakaoIcon} alt="1" className={'login-kakao-icn'} />
            ) : (
              <></>
            )
          }
        />
      </div>
    </div>
  );
}

export default Invitation;
