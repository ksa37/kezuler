import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { CURRENT_HOST } from 'src/constants/Auth';
import PathName from 'src/constants/PathName';
import useCopyText from 'src/hooks/useCopyText';
import useDialog from 'src/hooks/useDialog';
import { useDeletePendingEventById } from 'src/hooks/usePendingEvent';
import { modalAction } from 'src/reducers/modal';
import { BFixedEvent } from 'src/types/fixedEvent';
import { BPendingEvent } from 'src/types/pendingEvent';
import { dateStringToKorDate } from 'src/utils/dateParser';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';
import { isFixedEvent } from 'src/utils/typeGuard';

import OverviewButton from './OverviewButton';
import OverviewParticipants from './OverviewParticipants';
import OverviewSection from './OverviewSection';
import OverviewDropdown from 'src/components/modal/overview-modal/OverviewDropdown';

import { ReactComponent as CancelIcon } from 'src/assets/icn_cancel.svg';
import { ReactComponent as CloseIcon } from 'src/assets/icn_close_b.svg';
import { ReactComponent as CopyIcon } from 'src/assets/icn_copy.svg';
import { ReactComponent as DeleteIcon } from 'src/assets/icn_delete.svg';
import { ReactComponent as EditIcon } from 'src/assets/icn_edit.svg';
import { ReactComponent as LinkIcon } from 'src/assets/icn_link.svg';
import { ReactComponent as LocIcon } from 'src/assets/icn_location_y.svg';
import { ReactComponent as PCIcon } from 'src/assets/icn_pc_y.svg';
import 'src/styles/OverviewModal.scss';

interface Props {
  event: BFixedEvent | BPendingEvent;
  isCanceled?: boolean;
  isPassed?: boolean;
}

function OverviewModal({ event, isCanceled, isPassed }: Props) {
  const {
    eventId,
    eventTitle,
    eventDescription,
    eventAttachment,
    eventZoomAddress,
    eventPlace,
    eventHost: {
      userId: hostId,
      userName: hostName,
      userProfileImage: hostProfileImage,
    },
  } = event;

  const { copyText } = useCopyText();

  const isHost = useMemo(
    () => hostId === getCurrentUserInfo()?.userId,
    [hostId]
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

  const { openDialog } = useDialog();
  const { hide } = modalAction;
  const dispatch = useDispatch();

  const removePendingEvent = useDeletePendingEventById();

  const closeModal = useCallback(() => {
    dispatch(hide());
  }, [dispatch]);

  const handleModifyClick = () => {
    console.log('ho');
  };

  const handleDeleteClick = () => {
    const deleteMeeting = () => {
      removePendingEvent(eventId);
    };

    openDialog({
      title: `'${eventTitle}'\n미팅을 취소 하시겠어요?`,
      description:
        '취소 시, 되돌리기 어려우며\n참여자들에게 카카오톡 메세지가 전송됩니다.',
      onConfirm: deleteMeeting,
    });
  };

  const handleCancelClick = () => {
    const cancel = () => {
      //TODO pendingEvent Delete candidate 연결

      console.log('ho');
    };

    openDialog({
      title: `'${eventTitle}'\n미팅 참여를 취소 하시겠어요?`,
      onConfirm: cancel,
    });
  };

  const handleCopyLinkClick = () => {
    copyText(`${CURRENT_HOST}${PathName.invite}/${eventId}`, '케줄러 링크가');
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
        <CloseIcon />
      </button>
      <div className={'overview-container'}>
        <header className={'overview-header'}>
          <div className={'overview-header-title'}>미팅 제목</div>
          <h1 className={'overview-header-desc'}>{eventTitle}</h1>
          {isFixedEvent(event) && !isCanceled && !isPassed && (
            <OverviewDropdown />
          )}
        </header>
        <div className={'overview-body'}>
          {!isFixedEvent(event) && (
            <OverviewSection
              title={'주최자'}
              profileImageUrl={hostProfileImage}
              profileImageAlt={hostName}
            >
              {hostName}
            </OverviewSection>
          )}
          {eventDate && (
            <OverviewSection title={'일시'}>{eventDate}</OverviewSection>
          )}
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
          {isFixedEvent(event) && !isCanceled && (
            <OverviewParticipants event={event} />
          )}
        </div>
      </div>
      {!isCanceled && !isPassed && (
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
      )}
    </div>
  );
}

export default OverviewModal;
