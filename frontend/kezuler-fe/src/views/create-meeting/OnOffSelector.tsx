import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import classNames from 'classnames';

import { createMeetingActions } from 'src/reducers/CreateMeeting';
import { AppDispatch } from 'src/store';

function OnOffSelector() {
  const dispatch = useDispatch<AppDispatch>();
  const { setIsOnline, increaseStep } = createMeetingActions;

  const handleOnlineClick = () => {
    dispatch(setIsOnline(true));
    dispatch(increaseStep());
  };

  const handleOfflineClick = () => {
    dispatch(setIsOnline(false));
    dispatch(increaseStep());
  };

  return (
    <div>
      <div className={'description-text'}>
        {'어디에서'}
        <br /> {'만나면 좋을까요?'}
      </div>

      <div className={'on-off-group'}>
        <div
          className={classNames('on-off-btn', 'selected')}
          onClick={handleOnlineClick}
        >
          <div className={'circle-wrapper'}>
            <div className={'circle'}></div>
          </div>
          <div className={'on-off-title'}>온라인</div>
          <div className={'on-off-subtitle'}>비대면 미팅</div>
        </div>
        <div
          className={classNames('on-off-btn', 'disabled')}
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
        <div className={'title'}>{'접속링크'}</div>
        <input
          type="text"
          className={'field'}
          placeholder={'링크를 입력하세요.'}
        />
        <div className={'skip-text'}>
          {'아직 링크가 없다면 건너뛰기를 눌러주세요.'}
        </div>
      </div>
    </div>
  );
}

export default OnOffSelector;
