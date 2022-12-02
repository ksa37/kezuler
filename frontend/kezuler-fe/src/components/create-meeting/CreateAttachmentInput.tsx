import React, { ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import {
  INVALID_URL_ERROR,
  MAX_ATTACHMENT_LENGTH,
  MAX_ATTACHMENT_LENGTH_ERROR,
} from '../../constants/Validation';
import { RootState } from '../../reducers';
import { createMeetingActions } from '../../reducers/CreateMeeting';
import { AppDispatch } from '../../store';
import isURL from '../../utils/isURL';

interface Props {
  isDescriptionError: boolean;
  setError: (newVal: string) => void;
  error: string;
}

function CreateAttachmentInput({ isDescriptionError, setError, error }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { setAttachment } = createMeetingActions;

  const { eventAttachment } = useSelector(
    (state: RootState) => state.createMeeting
  );

  useEffect(() => {
    let attachmentError = '';
    if (eventAttachment) {
      if (eventAttachment.length > MAX_ATTACHMENT_LENGTH) {
        attachmentError = MAX_ATTACHMENT_LENGTH_ERROR;
      } else if (!isURL(eventAttachment)) {
        attachmentError = INVALID_URL_ERROR;
      }
    }

    setError(attachmentError);
  }, [eventAttachment]);

  const handleEventAttachmentChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(setAttachment(event.target.value));
  };

  const eventAttachmentDescription = 'URL주소를 입력해주세요.';

  return (
    <>
      <div
        className={classNames('meeting-additional', {
          'is-error': isDescriptionError,
        })}
      >
        <span className={classNames('meeting-additional-text')}>참조 링크</span>
      </div>
      <input
        type="text"
        id="url"
        className={classNames('meeting-field-title-and-reference', {
          error,
        })}
        placeholder={eventAttachmentDescription}
        value={eventAttachment}
        onChange={handleEventAttachmentChange}
      />
      {error && <div className={'create-meeting-error-text'}>{error}</div>}
    </>
  );
}

export default CreateAttachmentInput;
