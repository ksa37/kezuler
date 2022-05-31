import React, { ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { RootState } from 'src/reducers';
import { createMeetingActions } from 'src/reducers/CreateMeeting';
import { AppDispatch } from 'src/store';

function OnOffSelector() {
  const dispatch = useDispatch<AppDispatch>();
  const { setIsOnline, increaseStep, setZoomAddress, setPlace } =
    createMeetingActions;

  const { isOnline, eventZoomAddress, eventPlace } = useSelector(
    (state: RootState) => state.createMeeting
  );

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

  return (
    <div>
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
            <div className={'circle'}></div>
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
            <div className={'circle'}></div>
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
            isOnline ? '링크를 입력하세요.' : '장소 정보를 입력하세요.'
          }
        />
        {isOnline && (
          <div className={'skip-text'}>
            {'아직 링크가 없다면 건너뛰기를 눌러주세요.'}
          </div>
        )}
      </div>
    </div>
  );
}

export default OnOffSelector;
