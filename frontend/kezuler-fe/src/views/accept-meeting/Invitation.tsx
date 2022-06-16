import React, { useMemo, useState } from 'react';
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
import { AppDispatch } from 'src/store';
import { getCookie } from 'src/utils/cookie';

import BottomPopper from 'src/components/common/BottomPopper';

import { ReactComponent as LocIcon } from 'src/assets/icn_location_y.svg';
import { ReactComponent as PCIcon } from 'src/assets/icn_pc_y.svg';
import popupBgInvite from 'src/assets/popup_bg_invitation.svg';

function Invitation() {
  const dispatch = useDispatch<AppDispatch>();
  const { eventId, pendingEvent } = useSelector(
    (state: RootState) => state.acceptMeeting
  );
  const {
    eventHost,
    eventTitle,
    eventZoomAddress,
    eventPlace,
    declinedUsers,
    eventTimeCandidates,
  } = pendingEvent;
  const { increaseStep } = acceptMeetingActions;

  const navigate = useNavigate();

  const handleNextClick = () => {
    if (isModification) {
      navigate(`${PathName.modify}/${eventId}`);
    } else {
      dispatch(increaseStep());
    }
  };

  const handleConnectClick = () => {
    location.href = KAKAO_AUTH_URL;
    sessionStorage.setItem(LOGIN_REDIRECT_KEY, `${PathName.invite}/${eventId}`);
  };

  const isLoggedIn = useMemo(() => !!getCookie(ACCESS_TOKEN_KEY), []);

  //선택 이력이 있는지 확인
  const possibleUsersAll = eventTimeCandidates.reduce<string[]>(
    (prev, eventTimeCandidate) => {
      const userIds = eventTimeCandidate.possibleUsers.map((u) => u.userId);
      return prev.concat(userIds.filter((id) => prev.indexOf(id) < 0));
    },
    []
  );
  const declinedUsersAll = declinedUsers.map(
    (declinedUser) => declinedUser.userId
  );
  //TODO 서버에서 userId 가져오거나 localstorage에서 가져오기
  const currentUserId = 'user0002';
  const [isModification, setIsModification] = useState(
    possibleUsersAll.includes(currentUserId) ||
      declinedUsersAll.includes(currentUserId)
  );

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
            {eventPlace ? <LocIcon /> : <PCIcon />}
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
