import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { RootState } from 'src/reducers';
import { acceptMeetingActions } from 'src/reducers/AcceptMeeting';
import { AppDispatch } from 'src/store';

import BottomButton from 'src/components/common/BottomButton';
import TextAppBar from 'src/components/common/TextAppBar';

function Invitation() {
  const dispatch = useDispatch<AppDispatch>();
  const { pendingEvent } = useSelector(
    (state: RootState) => state.acceptMeeting
  );
  const {
    eventId,
    eventTitle,
    eventDescription,
    eventTimeDuration,
    declinedUsers,
    eventTimeCandidates,
    eventZoomAddress,
    eventPlace,
    eventAttachment,
  } = pendingEvent;
  const { increaseStep, decreaseStep } = acceptMeetingActions;

  const handleNextClick = () => {
    dispatch(increaseStep());
  };

  // const inviteDescription = '님이 미팅에 초대합니다.';
  //TODO: 정보 가져오기
  const hostName = '서혜민';
  const meetingTitleDescription = '미팅 제목';
  const meetingPlaceDescription = '미팅 장소';
  const timeSelectDescription = '참여 가능한 시간을 알려주세요';

  return (
    <div className={'invitation'}>
      <div className={'invitation-info'}>
        <div className={'invitation-message'}>
          <b>{hostName}</b>
          {'님이 '}
          <br />
          {'미팅에 초대합니다.'}
        </div>
        <img className={'invitation-avatar'} alt="" src="" />
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
        <h2>{timeSelectDescription}</h2>
        <BottomButton onClick={handleNextClick} text={'카카오로 계속하기'} />
      </div>
      {/* <BotomButton text={'다음'} onClick={handleNextClick} /> */}
    </div>
  );
}

export default Invitation;
