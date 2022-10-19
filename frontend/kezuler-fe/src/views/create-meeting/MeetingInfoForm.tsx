import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

import PathName from 'src/constants/PathName';
import {
  INVALID_URL_ERROR,
  MAX_ATTACHMENT_LENGTH,
  MAX_ATTACHMENT_LENGTH_ERROR,
  MAX_DESCRIPTION_LENGTH,
  MAX_DESCRIPTION_LENGTH_ERROR,
  MAX_TITLE_LENGTH,
  MAX_TITLE_LENGTH_ERROR,
} from 'src/constants/Validation';
import useIOSScroll from 'src/hooks/useIOSScroll';
import { RootState } from 'src/reducers';
import { createMeetingActions } from 'src/reducers/CreateMeeting';
import { AppDispatch } from 'src/store';
import isURL from 'src/utils/isURL';

import BottomButton from 'src/components/common/BottomButton';

interface CreateInfoErrorForm {
  title: string;
  description: string;
  attachment: string;
}

function MeetingInfoForm() {
  useIOSScroll();

  const dispatch = useDispatch<AppDispatch>();
  const { setTitle, setDescription, setAttachment } = createMeetingActions;

  const { eventTitle, eventDescription, eventAttachment } = useSelector(
    (state: RootState) => state.createMeeting
  );

  const [error, setError] = useState<CreateInfoErrorForm>({
    title: '',
    description: '',
    attachment: '',
  });

  useEffect(() => {
    const titleError =
      eventTitle.length > MAX_TITLE_LENGTH ? MAX_TITLE_LENGTH_ERROR : '';

    setError((prev) => ({
      ...prev,
      title: titleError,
    }));
  }, [eventTitle]);

  useEffect(() => {
    const descriptionError =
      eventDescription.length > MAX_DESCRIPTION_LENGTH
        ? MAX_DESCRIPTION_LENGTH_ERROR
        : '';

    setError((prev) => ({
      ...prev,
      description: descriptionError,
    }));
  }, [eventDescription]);

  useEffect(() => {
    let attachmentError = '';
    if (eventAttachment) {
      if (eventAttachment.length > MAX_ATTACHMENT_LENGTH) {
        attachmentError = MAX_ATTACHMENT_LENGTH_ERROR;
      } else if (!isURL(eventAttachment)) {
        attachmentError = INVALID_URL_ERROR;
      }
    }

    setError((prev) => ({
      ...prev,
      attachment: attachmentError,
    }));
  }, [eventAttachment]);

  // useEffect(() => {
  //   if (isMobile && isIOS) {
  //     if (focused) {
  //       focusDisable();
  //     } else {
  //       focusEnable();
  //     }
  //   }
  // }, [focused]);

  const navigate = useNavigate();

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
    navigate(PathName.createTime);
  };

  const handleEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key.toLowerCase() === 'enter') {
      document.getElementById('description')?.focus();
    }
  };

  const eventTitleDescription = '미팅 제목을 간단하게 적어주세요.';
  const eventDescriptDescription =
    '미팅 주제나 내용에 대해 알려주세요.(100자 이내)';
  const eventAttachmentDescription = 'URL주소를 입력해주세요.';

  const nextButtonDisabled =
    !eventTitle || !!error.title || !!error.attachment || !!error.description;

  return (
    <div className={'create-wrapper'}>
      <div className={'padding-wrapper'}>
        <div className={'description-text'}>
          {'이번 미팅에 대해'}
          <br />
          {'알려주세요'}
        </div>
        <div
          className={classNames('meeting-info', 'required', {
            'is-error': !!error.title,
          })}
        >
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
              'required',
              { error: error.title }
            )}
            placeholder={eventTitleDescription}
            value={eventTitle}
            onChange={handleEventTitleChange}
            onKeyPress={handleEnter}
          />
          {error.title && (
            <div className={'create-meeting-error-text'}>{error.title}</div>
          )}
        </div>
        <div
          className={classNames('meeting-info', 'additional', {
            'is-error': !!error.attachment,
          })}
        >
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
              'description',
              { error: error.description }
            )}
            placeholder={eventDescriptDescription}
            value={eventDescription}
            onChange={handleEventDescriptionChange}
          />
          {error.description && (
            <div className={'create-meeting-error-text'}>
              {error.description}
            </div>
          )}
          <div
            className={classNames('meeting-additional', 'url', {
              'is-error': !!error.description,
            })}
          >
            <span className={classNames('meeting-additional-text')}>
              참조 링크
            </span>
          </div>
          <input
            type="text"
            id="url"
            className={classNames('meeting-field-title-and-reference', {
              error: error.attachment,
            })}
            placeholder={eventAttachmentDescription}
            value={eventAttachment}
            onChange={handleEventAttachmentChange}
          />
          {error.attachment && (
            <div className={'create-meeting-error-text'}>
              {error.attachment}
            </div>
          )}
        </div>
        <BottomButton
          disabled={nextButtonDisabled}
          onClick={handleNextClick}
          text="다음"
        />
      </div>
    </div>
  );
}

export default MeetingInfoForm;
