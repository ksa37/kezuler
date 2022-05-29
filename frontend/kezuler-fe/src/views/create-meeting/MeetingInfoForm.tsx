import React, { ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, TextField } from '@mui/material';

import { usePostPendingEvent } from 'src/hooks/usePendingEvent';
import { RootState } from 'src/reducers';
import { createMeetingActions } from 'src/reducers/CreateMeeting';
import { AppDispatch } from 'src/store';
import { PendingEvent } from 'src/types/pendingEvent';

import BotomButton from 'src/components/common/BottomButton';

function MeetingInfoForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { setTitle, setDescription } = createMeetingActions;
  const {
    userId,
    eventId,
    eventTitle,
    eventDescription,
    eventTimeDuration,
    declinedUsers,
    eventTimeCandidates,
    eventZoomAddress,
    eventPlace,
    eventAttachment,
  } = useSelector((state: RootState) => state.createMeeting);

  const postPendingEvent = usePostPendingEvent();

  const handlePostClick = () => {
    const pendingEvent: PendingEvent = {
      userId,
      eventId,
      eventTitle,
      eventDescription,
      eventTimeDuration,
      declinedUsers,
      eventTimeCandidates,
      eventZoomAddress,
      eventPlace,
      eventAttachment,
    };
    postPendingEvent(pendingEvent);
  };

  const handleEventTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setTitle(event.target.value));
  };

  const handleEventDescriptionChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(setDescription(event.target.value));
  };

  const eventTitleDescription = '미팅 제목을 입력하세요.(필수)';
  const eventDescriptDescription =
    '미팅 주제나 내용에 대해 알려주세요.(000자 이내)';

  return (
    <>
      <h1>미팅 정보</h1>
      <h3>미팅 제목</h3>
      <TextField
        id="standard-basic"
        label={eventTitleDescription}
        variant="standard"
        value={eventTitle}
        onChange={handleEventTitleChange}
      />
      <h3>미팅 소개</h3>
      <TextField
        id="standard-basic"
        label={eventDescriptDescription}
        variant="standard"
        value={eventDescription}
        onChange={handleEventDescriptionChange}
      />
      <h3>참고 자료</h3>
      <label htmlFor="contained-button-file">
        <input
          style={{ display: 'none' }}
          accept="image/*"
          id="contained-button-file"
          multiple
          type="file"
        />
        <Button variant="contained" component="span">
          파일 추가
        </Button>
      </label>
      <BotomButton onClick={handlePostClick} text="완료" />
    </>
  );
}

export default MeetingInfoForm;
