import React, { ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, TextField } from '@mui/material';
import classNames from 'classnames';

import { usePostPendingEvent } from 'src/hooks/usePendingEvent';
import { RootState } from 'src/reducers';
import { createMeetingActions } from 'src/reducers/CreateMeeting';
import { AppDispatch } from 'src/store';
import { PendingEvent } from 'src/types/pendingEvent';

import BottomButton from 'src/components/common/BottomButton';

function MeetingInfoForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { setTitle, setDescription, increaseStep } = createMeetingActions;

  const { eventTitle, eventDescription } = useSelector(
    (state: RootState) => state.createMeeting
  );

  const handleEventTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setTitle(event.target.value));
  };

  const handleEventDescriptionChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(setDescription(event.target.value));
  };

  const handleNextClick = () => {
    dispatch(increaseStep());
  };

  const eventTitleDescription = '미팅 제목을 간단하게 적어주세요.';
  const eventDescriptDescription =
    '미팅 주제나 내용에 대해 알려주세요.(000자 이내)';
  const eventFileDescription = '참고자료를 첨부해주세요';
  const fileKindDescription = '이미지, PDF만 첨부가능합니다.';

  return (
    <div>
      <div className={'description-text'}>
        {'이번 미팅에 대해'}
        <br />
        {'알려주세요'}
      </div>
      <div className={classNames('meeting-info', 'required')}>
        <div className={classNames('meeting-title')}>
          <span className={classNames('meeting-title-text')}>미팅제목</span>
          <span className={classNames('meeting-title-required')}>
            *필수사항
          </span>
        </div>
        <input
          type="text"
          id="name"
          name="name"
          required
          className={'meeting-field-title-and-reference'}
          placeholder={eventTitleDescription}
          value={eventTitle}
          // minLength="4"
          // maxLength="8"
          // size="10"
          onChange={handleEventTitleChange}
        />
        {/* <TextField
          id="standard-basic"
          className={'meeting-field-title-and-reference'}
          label={eventTitleDescription}
          variant="standard"
          value={eventTitle}
          onChange={handleEventTitleChange}
        /> */}
      </div>
      <div className={classNames('meeting-info', 'additional')}>
        <div className={classNames('meeting-additional')}>
          <span className={classNames('meeting-additional-text')}>
            추가정보
          </span>
          <span className={classNames('meeting-additional-additional')}>
            선택사항
          </span>
        </div>
        <input
          type="text"
          id="name"
          name="name"
          className={'meeting-field-title-and-reference'}
          placeholder={eventDescriptDescription}
          value={eventDescription}
          // minLength="4"
          // maxLength="8"
          // size="10"
          onChange={handleEventDescriptionChange}
        />

        <label htmlFor="contained-button-file">
          <input
            className={'meeting-field-title-and-reference'}
            accept="image/*"
            id="contained-button-file"
            multiple
            type="file"
            placeholder={eventFileDescription}
          />
        </label>
      </div>
      {fileKindDescription}
      {eventTitle ? (
        <BottomButton onClick={handleNextClick} text="다음" />
      ) : (
        <BottomButton disabled={true} text="미팅 제목을 입력해주세요" />
      )}
    </div>
  );
}

export default MeetingInfoForm;
