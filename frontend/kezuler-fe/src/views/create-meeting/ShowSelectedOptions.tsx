import React, { ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField } from '@mui/material';

import { RootState } from '../../reducers';
import { createMeetingActions } from '../../reducers/CreateMeeting';
import { AppDispatch } from '../../store/store';

import BlackButton from '../../components/BlackButton';

function ShowSelectedOptions() {
  const mainDescription = '선택한 날짜와 시간을 확인해주세요';
  const subDescription = '총 5개의 시간대를 선택하셨어요';

  const dispatch = useDispatch<AppDispatch>();
  const { increaseStep, decreaseStep, setZoomAddress, setPlace } =
    createMeetingActions;
  const { isOnline, eventZoomAddress, eventPlace } = useSelector(
    (state: RootState) => state.createMeeting
  );

  const handleOnlineChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setZoomAddress(event.target.value));
  };

  const handleOfflineChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setPlace(event.target.value));
  };

  const handlePrevClick = () => {
    dispatch(decreaseStep());
  };

  const handleNextClick = () => {
    dispatch(increaseStep());
  };

  return (
    <>
      <h1>{mainDescription}</h1>
      <h3>{subDescription}</h3>

      <BlackButton onClick={handleNextClick} text="다음" />
    </>
  );
}

export default ShowSelectedOptions;
