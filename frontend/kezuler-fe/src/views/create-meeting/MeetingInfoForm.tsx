import React, { ChangeEvent, KeyboardEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { RootState } from 'src/reducers';
import { createMeetingActions } from 'src/reducers/CreateMeeting';
import { AppDispatch } from 'src/store';

import BottomButton from 'src/components/common/BottomButton';

function MeetingInfoForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { setTitle, setDescription, increaseStep, setAttachment } =
    createMeetingActions;

  const { eventTitle, eventDescription, eventAttachment } = useSelector(
    (state: RootState) => state.createMeeting
  );

  const handleEventTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setTitle(event.target.value));
  };

  const handleEventDescriptionChange = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    dispatch(setDescription(event.target.value));
  };
  const handleEventAttachmentChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(setAttachment(event.target.value));
  };

  const handleNextClick = () => {
    dispatch(increaseStep());
  };

  const handleEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key.toLowerCase() === 'enter') {
      console.log('hello there!');
      document.getElementById('description')?.focus();
    }
  };

  const eventTitleDescription = '미팅 제목을 간단하게 적어주세요.';
  const eventDescriptDescription =
    '미팅 주제나 내용에 대해 알려주세요.(100자 이내)';
  const eventAttachmentDescription = 'URL주소를 입력해주세요.';

  return (
    <div className={'padding-wrapper'}>
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
          id="title"
          required
          className={classNames(
            'meeting-field-title-and-reference',
            'required'
          )}
          placeholder={eventTitleDescription}
          value={eventTitle}
          maxLength={15}
          onChange={handleEventTitleChange}
          onKeyPress={handleEnter}
        />
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
        <textarea
          id="description"
          className={classNames(
            'meeting-field-title-and-reference',
            'description'
          )}
          placeholder={eventDescriptDescription}
          value={eventDescription}
          maxLength={100}
          onChange={handleEventDescriptionChange}
        />
        <div className={classNames('meeting-additional', 'url')}>
          <span className={classNames('meeting-additional-text')}>
            참고자료
          </span>
        </div>
        <input
          type="text"
          id="url"
          className={'meeting-field-title-and-reference'}
          placeholder={eventAttachmentDescription}
          value={eventAttachment}
          maxLength={25}
          onChange={handleEventAttachmentChange}
        />
      </div>
      <BottomButton
        disabled={eventTitle ? false : true}
        onClick={handleNextClick}
        text="다음"
      />
    </div>
  );
}

export default MeetingInfoForm;
