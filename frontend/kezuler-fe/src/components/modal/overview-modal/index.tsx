import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import useCopyText from 'src/hooks/useCopyText';
import { modalAction } from 'src/reducers/modal';
import { BFixedEvent } from 'src/types/fixedEvent';
import { BPendingEvent } from 'src/types/pendingEvent';
import { dateStringToKorDate } from 'src/utils/dateParser';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';
import { isFixedEvent } from 'src/utils/typeGuard';

import OverviewButton from './OverviewButton';
import OverviewParticipants from './OverviewParticipants';
import OverviewSection from './OverviewSection';

import 'src/styles/OverviewModal.scss';

interface Props {
  event: BFixedEvent | BPendingEvent;
}

function OverviewModal({ event }: Props) {
  const {
    eventTitle,
    eventDescription,
    eventAttachment,
    eventHostId,
    eventZoomAddress,
    eventPlace,
  } = event;

  const { copyText } = useCopyText();

  const isHost = useMemo(
    () => eventHostId === getCurrentUserInfo()?.userId,
    [eventHostId]
  );

  const place = useMemo(
    () => (eventZoomAddress ? '온라인' : eventPlace),
    [eventZoomAddress, eventPlace]
  );

  const eventDate = useMemo(() => {
    if (isFixedEvent(event)) {
      return dateStringToKorDate(event.eventTimeStartsAt);
    }
    return '';
  }, [event]);

  const host = 'hi';

  // TODO get Host User Info

  const { hide } = modalAction;
  const dispatch = useDispatch();

  const closeModal = useCallback(() => {
    dispatch(hide());
  }, [dispatch, hide]);

  const handleModifyClick = () => {
    console.log('ho');
  };

  const handleDeleteClick = () => {
    console.log('ho');
  };

  const handleCancelClick = () => {
    console.log('ho');
  };

  const handleCopyLinkClick = () => {
    copyText('hello', '케줄러 링크가');
  };

  const handleCopyPlaceClick = () => {
    copyText(place, '장소가');
  };

  const handleAttachmentClick = () => {
    copyText(eventAttachment, '참고 자료가');
  };

  return (
    <div className={'overview'}>
      <button className={'overview-close-btn'} onClick={closeModal}>
        닫기
        <span>X</span>
      </button>
      <div className={'overview-container'}>
        <header className={'overview-header'}>
          <div className={'overview-header-title'}>미팅 제목</div>
          <h1 className={'overview-header-desc'}>{eventTitle}</h1>
        </header>
        <div className={'overview-body'}>
          {!isFixedEvent(event) && (
            <OverviewSection title={'주최자'} profileImageUrl={'hi'}>
              {host}
            </OverviewSection>
          )}
          <OverviewSection title={'일시'}>{eventDate}</OverviewSection>
          <OverviewSection title={'장소'}>
            <div>
              <span>Icon</span>
              {place}
            </div>
            <button
              className={'overview-section-copy-btn'}
              onClick={handleCopyPlaceClick}
            >
              <span>Icon</span>
              복사하기
            </button>
          </OverviewSection>
          <OverviewSection title={'미팅 내용'}>
            {eventDescription}
          </OverviewSection>
          <OverviewSection title={'참고 자료'}>
            <a
              href={eventAttachment}
              target="_blank"
              rel="noreferrer"
              className={'overview-section-attachment'}
            >
              {eventAttachment}
            </a>
            <button
              className={'overview-section-copy-btn'}
              onClick={handleAttachmentClick}
            >
              <span>Icon</span>
              복사하기
            </button>
          </OverviewSection>
          {isFixedEvent(event) && (
            <OverviewParticipants participants={event.participants} />
          )}
        </div>
      </div>
      <footer className={'overview-footer'}>
        {isHost ? (
          <>
            <OverviewButton
              icon={<div />}
              onClick={handleModifyClick}
              text={'미팅정보수정'}
            />
            <OverviewButton
              icon={<div />}
              onClick={handleDeleteClick}
              text={'미팅삭제'}
            />
          </>
        ) : (
          <OverviewButton
            icon={<div />}
            onClick={handleCancelClick}
            text={'참여취소'}
          />
        )}
        <OverviewButton
          icon={<div />}
          onClick={handleCopyLinkClick}
          text={'케줄러링크 복사'}
        />
      </footer>
    </div>
  );
}

export default OverviewModal;
