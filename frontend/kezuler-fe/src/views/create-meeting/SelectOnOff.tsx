import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';

import { createMeetingActions } from '../../reducers/CreateMeeting';
import { AppDispatch } from '../../store/store';

function SelectOnOff() {
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
      <h1>어디서 봐요?</h1>
      <h3>만나는 장소를 지정해주세요.</h3>
      <Button onClick={handleOnlineClick}>온라인</Button>
      <Button onClick={handleOfflineClick}>오프라인</Button>
    </div>
  );
}

export default SelectOnOff;
