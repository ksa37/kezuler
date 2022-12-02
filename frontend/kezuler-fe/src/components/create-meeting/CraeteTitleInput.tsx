import React, { ChangeEvent, KeyboardEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import {
  MAX_TITLE_LENGTH,
  MAX_TITLE_LENGTH_ERROR,
} from '../../constants/Validation';
import { RootState } from '../../reducers';
import { createMeetingActions } from '../../reducers/CreateMeeting';
import { AppDispatch } from '../../store';

interface Props {
  setError: (newVal: string) => void;
  error: string;
}

function CreateTitleInput({ setError, error }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { setTitle } = createMeetingActions;

  const { eventTitle } = useSelector((state: RootState) => state.createMeeting);

  useEffect(() => {
    const titleError =
      eventTitle.length > MAX_TITLE_LENGTH ? MAX_TITLE_LENGTH_ERROR : '';

    setError(titleError);
  }, [eventTitle]);

  const handleEventTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setTitle(event.target.value));
  };

  const eventTitleDescription = '미팅 제목을 간단하게 적어주세요.';

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key.toLowerCase() === 'enter') {
      document.getElementById('description')?.focus();
    }
  };

  return (
    <div
      className={classNames('meeting-info', 'required', {
        'is-error': !!error,
      })}
    >
      <div className={classNames('meeting-title')}>
        <span className={classNames('meeting-title-text')}>미팅제목</span>
        <span className={classNames('meeting-title-required')}>*필수사항</span>
      </div>
      <input
        type="text"
        id="title"
        required
        className={classNames('meeting-field-title-and-reference', 'required', {
          error,
        })}
        placeholder={eventTitleDescription}
        value={eventTitle}
        onChange={handleEventTitleChange}
        onKeyDown={handleKeyDown}
      />
      {error && <div className={'create-meeting-error-text'}>{error}</div>}
    </div>
  );
}

export default CreateTitleInput;
