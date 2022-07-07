import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { CURRENT_HOST } from 'src/constants/Auth';
import { OVERVIEW_FORM_ID } from 'src/constants/Main';
import PathName, {
  makeFixedInfoUrl,
  makePendingInfoUrl,
} from 'src/constants/PathName';
import useCopyText from 'src/hooks/useCopyText';
import useDialog from 'src/hooks/useDialog';
import { useDeleteFixedEvent } from 'src/hooks/useFixedEvent';
import { useDeletePendingEventById } from 'src/hooks/usePendingEvent';
import { RootState } from 'src/reducers';
import { BFixedEvent } from 'src/types/fixedEvent';
import { BPendingEvent } from 'src/types/pendingEvent';
import { dateStringToKorDate } from 'src/utils/dateParser';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';
import getTimezoneDate from 'src/utils/getTimezoneDate';
import { isFixedEvent } from 'src/utils/typeGuard';

import OverviewBody from './OverviewBody';
import OverviewButton from './OverviewButton';
import OverviewEdit from './OverviewEdit';

import { ReactComponent as CancelIcon } from 'src/assets/icn_cancel.svg';
import { ReactComponent as CheckIcon } from 'src/assets/icn_check.svg';
import { ReactComponent as CloseIcon } from 'src/assets/icn_close_b.svg';
import { ReactComponent as CloseThinIcon } from 'src/assets/icn_close_thin.svg';
import { ReactComponent as DeleteIcon } from 'src/assets/icn_delete.svg';
import { ReactComponent as EditIcon } from 'src/assets/icn_edit_big.svg';
import { ReactComponent as LinkIcon } from 'src/assets/icn_link.svg';

function Overview() {
  // const location = useLocation();
  const { eventId } = useParams();
  const navigate = useNavigate();

  const isFixedMeeting = location.pathname.startsWith(PathName.mainFixed);

  const regex = new RegExp(
    `(${PathName.mainFixed}|${PathName.pending})/.+/info-edit`
  );
  const isEdit = location.pathname.search(regex) !== -1;

  if (!eventId) {
    return null;
  }

  const { events: fixedEvents } = useSelector(
    (state: RootState) => state.mainFixed
  );
  const { events: pendingEvents } = useSelector(
    (state: RootState) => state.mainPending
  );

  const event: BFixedEvent | BPendingEvent | undefined = useMemo(() => {
    if (isFixedMeeting) {
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

  const isCanceled = isFixedEvent(event) && event.isDisabled;

  const checkPassed = () => {
    if (!isFixedEvent(event)) {
      return false;
    }
    const now = getTimezoneDate(new Date().getTime());
    const date = getTimezoneDate(new Date(event.eventTimeStartsAt).getTime());
    return now.getTime() > date.getTime();
  };

  const isPassed = checkPassed();

  const { copyText } = useCopyText();

  const isHost = useMemo(
    () => hostId === getCurrentUserInfo()?.userId,
    [hostId]
  );

  const { openDialog } = useDialog();

  const removePendingEvent = useDeletePendingEventById();
  const removeFixedEvent = useDeleteFixedEvent();

  const closeModal = () => {
    navigate(isFixedMeeting ? PathName.mainFixed : PathName.mainPending);
  };

  // 수정
  const handleModifyStartClick = () => {
    navigate(
      (isFixedMeeting ? makeFixedInfoUrl : makePendingInfoUrl)(eventId, true)
    );
  };

  // 수정 취소
  const handleModifyCancelClick = () => {
    navigate((isFixedMeeting ? makeFixedInfoUrl : makePendingInfoUrl)(eventId));
  };

  const handleDeleteClick = () => {
    const deleteFixedMeeting = () => {
      removeFixedEvent(eventId);
      closeModal();
      navigate(PathName.mainFixed);
      location.reload();
    };

    const deletePendingMeeting = () => {
      removePendingEvent(eventId);
      closeModal();
      navigate(PathName.mainPending);
      location.reload();
    };

    openDialog({
      title: `'${eventTitle}'\n미팅을 취소 하시겠어요?`,
      description:
        '취소 시, 되돌리기 어려우며\n참여자들에게 카카오톡 메세지가 전송됩니다.',
      onConfirm: isFixedEvent(event)
        ? deleteFixedMeeting
        : deletePendingMeeting,
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
          <OverviewEdit eventDate={eventDate} event={event} />
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

export default Overview;
