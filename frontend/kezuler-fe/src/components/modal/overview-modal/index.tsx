import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CURRENT_HOST } from 'src/constants/Auth';
import { OVERVIEW_FORM_ID } from 'src/constants/Main';
import PathName from 'src/constants/PathName';
import useCopyText from 'src/hooks/useCopyText';
import useDialog from 'src/hooks/useDialog';
import { useDeletePendingEventById } from 'src/hooks/usePendingEvent';
import { RootState } from 'src/reducers';
import { modalAction } from 'src/reducers/modal';
import { BFixedEvent } from 'src/types/fixedEvent';
import { BPendingEvent } from 'src/types/pendingEvent';
import { dateStringToKorDate } from 'src/utils/dateParser';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';
import { isFixedEvent } from 'src/utils/typeGuard';

import OverviewButton from './OverviewButton';
import OverviewBody from 'src/components/modal/overview-modal/OverviewBody';
import OverviewEdit from 'src/components/modal/overview-modal/OverviewEdit';

import { ReactComponent as CancelIcon } from 'src/assets/icn_cancel.svg';
import { ReactComponent as CheckIcon } from 'src/assets/icn_check.svg';
import { ReactComponent as CloseIcon } from 'src/assets/icn_close_b.svg';
import { ReactComponent as CloseThinIcon } from 'src/assets/icn_close_thin.svg';
import { ReactComponent as DeleteIcon } from 'src/assets/icn_delete.svg';
import { ReactComponent as EditIcon } from 'src/assets/icn_edit.svg';
import { ReactComponent as LinkIcon } from 'src/assets/icn_link.svg';
import 'src/styles/OverviewModal.scss';

interface Props {
  isFixed: boolean;
  eventId: string;
  isCanceled?: boolean;
  isPassed?: boolean;
}

function OverviewModal({ isFixed, eventId, isCanceled, isPassed }: Props) {
  const { events: fixedEvents } = useSelector(
    (state: RootState) => state.mainFixed
  );
  const { events: pendingEvents } = useSelector(
    (state: RootState) => state.mainPending
  );

  const event: BFixedEvent | BPendingEvent | undefined = useMemo(() => {
    if (isFixed) {
      return fixedEvents.find((e) => e.eventId === eventId);
    }
    return pendingEvents.find((e) => e.eventId === eventId);
  }, [fixedEvents, pendingEvents, eventId]);

  if (!event) {
    return null;
  }

  const {
    eventTitle,
    eventHost: { userId: hostId },
  } = event;

  const { copyText } = useCopyText();

  const [isEdit, setIsEdit] = useState(false);

  const isHost = useMemo(
    () => hostId === getCurrentUserInfo()?.userId,
    [hostId]
  );

  const { openDialog } = useDialog();
  const { hide } = modalAction;
  const dispatch = useDispatch();

  const removePendingEvent = useDeletePendingEventById();

  const closeModal = useCallback(() => {
    dispatch(hide());
  }, [dispatch]);

  // 수정
  const handleModifyStartClick = () => {
    setIsEdit(true);
  };

  // 수정 취소
  const handleModifyCancelClick = () => {
    setIsEdit(false);
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

  const eventDate = useMemo(() => {
    if (isFixedEvent(event)) {
      return dateStringToKorDate(event.eventTimeStartsAt);
    }
    return '';
  }, [event]);

  return (
    <div className={'overview'}>
      <button className={'overview-close-btn'} onClick={closeModal}>
        닫기
        <CloseIcon />
      </button>
      <div className={'overview-container'}>
        {isEdit ? (
          <OverviewEdit
            setIsEdit={setIsEdit}
            eventDate={eventDate}
            event={event}
          />
        ) : (
          <OverviewBody eventDate={eventDate} event={event} />
        )}
      </div>
      {!isCanceled && !isPassed && (
        <footer className={'overview-footer'}>
          {isEdit ? (
            <>
              <OverviewButton
                className={'edit'}
                icon={<CheckIcon />}
                text={'변경 저장'}
                type={'submit'}
                formId={OVERVIEW_FORM_ID}
              />
              <OverviewButton
                className={'edit'}
                icon={<CloseThinIcon />}
                onClick={handleModifyCancelClick}
                text={'변경 취소'}
              />
            </>
          ) : (
            <>
              {isHost ? (
                <>
                  <OverviewButton
                    icon={<EditIcon />}
                    onClick={handleModifyStartClick}
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
            </>
          )}
        </footer>
      )}
    </div>
  );
}

export default OverviewModal;
