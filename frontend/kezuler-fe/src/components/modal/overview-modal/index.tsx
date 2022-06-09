import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import useCopyText from 'src/hooks/useCopyText';
import { modalAction } from 'src/reducers/modal';
import { BFixedEvent } from 'src/types/fixedEvent';
import { BPendingEvent } from 'src/types/pendingEvent';
import { User } from 'src/types/user';
import { dateStringToKorDate } from 'src/utils/dateParser';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';
import { isFixedEvent } from 'src/utils/typeGuard';

import OverviewButton from './OverviewButton';
import OverviewParticipants from './OverviewParticipants';
import OverviewSection from './OverviewSection';
import OverviewDropdown from 'src/components/modal/overview-modal/OverviewDropdown';

import { ReactComponent as CancelIcon } from 'src/assets/icn_cancel.svg';
import { ReactComponent as CopyIcon } from 'src/assets/icn_copy.svg';
import { ReactComponent as DeleteIcon } from 'src/assets/icn_delete.svg';
import { ReactComponent as EditIcon } from 'src/assets/icn_edit.svg';
import { ReactComponent as LinkIcon } from 'src/assets/icn_link.svg';
import { ReactComponent as LocIcon } from 'src/assets/icn_location_y.svg';
import { ReactComponent as PCIcon } from 'src/assets/icn_pc_y.svg';
import 'src/styles/OverviewModal.scss';

interface Props {
  event: BFixedEvent | BPendingEvent;
}

function OverviewModal({ event }: Props) {
  const {
    eventTitle,
    eventDescription,
    eventAttachment,
    eventHost,
    eventZoomAddress,
    eventPlace,
  } = event;

  const { copyText } = useCopyText();

  const isHost = useMemo(
    () => eventHost.userId === getCurrentUserInfo()?.userId,
    [eventHost.userId]
  );

  const place = useMemo(
    () =>
      eventZoomAddress ? (
        <div className={'overview-section-place'}>
          <PCIcon />
          온라인
        </div>
      ) : (
        <div className={'overview-section-place'}>
          <LocIcon />
          {eventPlace}
        </div>
      ),
    [eventZoomAddress, eventPlace]
  );

  const eventDate = useMemo(() => {
    if (isFixedEvent(event)) {
      return dateStringToKorDate(event.eventTimeStartsAt);
    }
    return '';
  }, [event]);

  // TODO get Host User Info
  const host: User = {
    userId: 'hi',
    userName: 'hi',
    userPhoneNumber: '01072311490',
    userProfileImage: 'hi',
  };

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
    if (eventZoomAddress) {
      copyText(eventZoomAddress, '주소가');
    } else {
      copyText(eventPlace, '장소가');
    }
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
          {isFixedEvent(event) && <OverviewDropdown />}
        </header>
        <div className={'overview-body'}>
          {!isFixedEvent(event) && (
            <OverviewSection title={'주최자'} profileImageUrl={'hi'}>
              {host.userName}
            </OverviewSection>
          )}
          <OverviewSection title={'일시'}>{eventDate}</OverviewSection>
          <OverviewSection title={'장소'}>
            {place}
            <button
              className={'overview-section-copy-btn'}
              onClick={handleCopyPlaceClick}
            >
              <CopyIcon />
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
              <CopyIcon />
              복사하기
            </button>
          </OverviewSection>
          {isFixedEvent(event) && (
            <OverviewParticipants
              host={host}
              participants={event.participants}
            />
          )}
        </div>
      </div>
      <footer className={'overview-footer'}>
        {isHost ? (
          <>
            <OverviewButton
              icon={<EditIcon />}
              onClick={handleModifyClick}
              text={'미팅정보수정'}
            />
            <OverviewButton
              icon={<DeleteIcon />}
              onClick={handleDeleteClick}
              text={'미팅삭제'}
            />
          </>
        ) : (
          <OverviewButton
            icon={<CancelIcon />}
            onClick={handleCancelClick}
            text={'참여취소'}
          />
        )}
        <OverviewButton
          icon={<LinkIcon />}
          onClick={handleCopyLinkClick}
          text={'케줄러링크 복사'}
        />
      </footer>
    </div>
  );
}

export default OverviewModal;
