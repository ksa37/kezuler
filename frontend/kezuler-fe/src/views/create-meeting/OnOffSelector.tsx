import React, { ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { usePostPendingEvent } from 'src/hooks/usePendingEvent';
import { RootState } from 'src/reducers';
import { createMeetingActions } from 'src/reducers/CreateMeeting';
import { AppDispatch } from 'src/store';
import { PPostPendingEvent } from 'src/types/pendingEvent';

// import { isoStringToDateString } from 'src/utils/dateParser';
import BottomButton from 'src/components/common/BottomButton';

import { ReactComponent as OfflineIcon } from 'src/assets/offline_icon.svg';
import { ReactComponent as OnlineIcon } from 'src/assets/online_icon.svg';

function OnOffSelector() {
  const dispatch = useDispatch<AppDispatch>();
  const { setIsOnline, setZoomAddress, setPlace, setEventTimeCandidates } =
    createMeetingActions;

  const {
    eventTitle,
    eventDescription,
    eventTimeDuration,
    eventTimeCandidates,
    eventZoomAddress,
    eventPlace,
    eventAttachment,
    isOnline,
    eventTimeList,
  } = useSelector((state: RootState) => state.createMeeting);

  const handleOnlineClick = () => {
    dispatch(setIsOnline(true));
  };

  const handleOfflineClick = () => {
    dispatch(setIsOnline(false));
  };

  const handleOnlineChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setZoomAddress(event.target.value));
  };

  const handleOfflineChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setPlace(event.target.value));
  };

  const postPendingEventAndGetShareUrl = usePostPendingEvent();

  const handlePostClick = () => {
    dispatch(setEventTimeCandidates(eventTimeList));

    const ppostPendingEventData: PPostPendingEvent = {
      eventTitle: eventTitle,
      eventDescription: eventDescription,
      eventTimeDuration: eventTimeDuration,
      eventTimeCandidates: eventTimeCandidates,
      eventZoomAddress: eventZoomAddress,
      eventPlace: eventPlace,
      eventAttachment: eventAttachment,
    };

    postPendingEventAndGetShareUrl(ppostPendingEventData);
  };

  return (
    <div className={'padding-wrapper'}>
      <div className={'description-text'}>
        {'어디에서'}
        <br /> {'만나면 좋을까요?'}
      </div>

      <div className={'on-off-group'}>
        <div
          className={classNames(
            'on-off-btn',
            isOnline ? 'selected' : 'disabled'
          )}
          onClick={handleOnlineClick}
        >
          <div className={'circle-wrapper'}>
            <div className={'circle'}>
              <OnlineIcon />
            </div>
          </div>
          <div className={'on-off-title'}>온라인</div>
          <div className={'on-off-subtitle'}>비대면 미팅</div>
        </div>
        <div
          className={classNames(
            'on-off-btn',
            isOnline ? 'disabled' : 'selected'
          )}
          onClick={handleOfflineClick}
        >
          <div className={'circle-wrapper'}>
            <div className={'circle'}>
              <OfflineIcon />
            </div>
          </div>
          <div className={'on-off-title'}>오프라인</div>
          <div className={'on-off-subtitle'}>대면 미팅</div>
        </div>
      </div>

      <div className={'on-off-textfield'}>
        <div className={'title'}>{isOnline ? '접속링크' : '장소'}</div>
        <input
          type="text"
          className={'field'}
          value={isOnline ? eventZoomAddress : eventPlace}
          onChange={isOnline ? handleOnlineChange : handleOfflineChange}
          placeholder={
            isOnline
              ? '링크를 입력하세요.'
              : '만날 장소 또는 주소를 입력하세요.'
          }
        />
        {isOnline && (
          <div className={'skip-text'}>
            {'아직 링크가 없다면 건너뛰기를 눌러주세요.'}
          </div>
        )}
      </div>
      <BottomButton
        onClick={!isOnline && eventPlace === '' ? undefined : handlePostClick}
        text={isOnline && eventZoomAddress === '' ? '건너뛰기' : '다음'}
        disabled={!isOnline && eventPlace === ''}
      />
    </div>
  );
}

export default OnOffSelector;
