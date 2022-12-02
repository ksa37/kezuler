import React, { ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import {
  MAX_DESCRIPTION_LENGTH,
  MAX_DESCRIPTION_LENGTH_ERROR,
} from '../../constants/Validation';
import { RootState } from '../../reducers';
import { createMeetingActions } from '../../reducers/CreateMeeting';
import { AppDispatch } from '../../store';

interface Props {
  setError: (newVal: string) => void;
  error: string;
}

function CreateDescriptionInput({ setError, error }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { setDescription } = createMeetingActions;

  const { eventDescription } = useSelector(
    (state: RootState) => state.createMeeting
  );

  useEffect(() => {
    const descriptionError =
      eventDescription.length > MAX_DESCRIPTION_LENGTH
        ? MAX_DESCRIPTION_LENGTH_ERROR
        : '';

    setError(descriptionError);
  }, [eventDescription]);

  const handleEventDescriptionChange = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    dispatch(setDescription(event.target.value));
  };

  const eventDescriptDescription =
    '미팅 주제나 내용에 대해 알려주세요.(100자 이내)';

  return (
    <>
      <div className={classNames('meeting-additional')}>
        <span className={classNames('meeting-additional-text')}>추가정보</span>
        <span className={classNames('meeting-additional-additional')}>
          선택사항
        </span>
      </div>
      <textarea
        id="description"
        className={classNames(
          'meeting-field-title-and-reference',
          'description',
          { error }
        )}
        placeholder={eventDescriptDescription}
        value={eventDescription}
        onChange={handleEventDescriptionChange}
      />
      {error && <div className={'create-meeting-error-text'}>{error}</div>}
    </>
  );
}

export default CreateDescriptionInput;
