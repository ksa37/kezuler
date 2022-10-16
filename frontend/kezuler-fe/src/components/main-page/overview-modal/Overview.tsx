import React, { useMemo, useState } from 'react';
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
import {
  useCancelFixedEvent,
  useCancelFixedEventGuest,
  useDeleteFixedEvent,
  useDeleteFixedEventGuest,
} from 'src/hooks/useFixedEvent';
import {
  useCancelPendingEventByGuest,
  useCancelPendingEventById,
  useDeletePendingEventById,
} from 'src/hooks/usePendingEvent';
import { RootState } from 'src/reducers';
import { BFixedEvent } from 'src/types/fixedEvent';
import { BPendingEvent } from 'src/types/pendingEvent';
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
import { ReactComponent as JoinIcon } from 'src/assets/icn_join.svg';
import { ReactComponent as LinkIcon } from 'src/assets/icn_link.svg';

import {
  cancelFixedEventGuestById,
  putFixedEventGuestById,
} from 'src/api/fixedEvent';
import { cancelMeetingByHost } from 'src/api/pendingEvent';

function Overview() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [isSaveAvailable, setIsSaveAvailable] = useState(true);

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

  const isCanceled = event.disable;

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

  const isAccepted = useMemo(() => {
    if (isFixedEvent(event)) {
      const currentUser = event.participants.filter(
        (p) => p.userId === getCurrentUserInfo()?.userId
      );
      return currentUser[0]?.userStatus === 'Accepted';
    }
  }, [event]);

  const { openDialog } = useDialog();

  const deletePendingEventHost = useDeletePendingEventById();
  const deleteFixedEventHost = useDeleteFixedEvent();
  const cancelPendingEventHost = useCancelPendingEventById();
  const cancelFixedEventHost = useCancelFixedEvent();

  const cancelPendingEventGuest = useCancelPendingEventByGuest();
  const deleteFixedEventGuest = useDeleteFixedEventGuest();
  const cancelFixedEventGuest = useCancelFixedEventGuest();

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

  // cancelFixedEventHost(eventId);
  const handleCancelHostClick = () => {
    const cancelFixedMeeting = () => {
      cancelFixedEventHost(eventId);
      // cancelMeetingByHost(eventId);
      location.reload();
    };

    const cancelPendingMeeting = () => {
      cancelPendingEventHost(eventId);
      location.reload();
    };

    console.log(isFixedEvent(event));
    openDialog({
      title: `'${eventTitle}'\n미팅을 취소 하시겠어요?`,
      description:
        '취소 시, 되돌리기 어려우며\n참여자들에게 카카오톡 메세지가 전송됩니다.',
      onConfirm: isFixedEvent(event)
        ? cancelFixedMeeting
        : cancelPendingMeeting,
    });
  };

  const handleDeleteHostClick = () => {
    const deleteFixedMeeting = () => {
      deleteFixedEventHost(eventId);
      closeModal();
      navigate(PathName.mainFixed);
      location.reload();
    };

    const deletePendingMeeting = () => {
      deletePendingEventHost(eventId);
      closeModal();
      navigate(PathName.mainPending);
      location.reload();
    };

    openDialog({
      title: `'${eventTitle}'\n미팅 카드를 삭제 하시겠어요?`,
      description:
        '삭제 시, 되돌리기 어려우며\n다가오는 미팅 목록에서 사라집니다.',
      onConfirm: isFixedEvent(event)
        ? deleteFixedMeeting
        : deletePendingMeeting,
    });
  };
  // cancelFixedEventGuest(eventId);
  // cancelFixedEventGuestById(eventId);
  // console.log(eventId);
  const handleCancelGuestFixedClick = () => {
    const cancel = () => {
      cancelFixedEventGuest(eventId);
      // cancelFixedEventGuestById(eventId);
      location.reload();
    };
    // cancelFixedEventGuest(eventId);
    // cancelFixedEventGuestById(eventId);
    // location.reload();
    openDialog({
      title: `'${eventTitle}'\n미팅 참여를 취소 하시겠어요?`,
      onConfirm: cancel,
    });
  };

  const handleCancelGuestPendingClick = () => {
    const cancel = () => {
      cancelPendingEventGuest(eventId);
      closeModal();
      navigate(PathName.mainPending);
      location.reload();
    };

    openDialog({
      title: `'${eventTitle}'\n미팅 카드를 삭제 하시겠어요?`,
      description:
        '삭제 시, 되돌리기 어려우며\n투표중인 미팅 목록에서 사라집니다.',
      onConfirm: cancel,
    });
  };

  const handleDeleteGuestClick = () => {
    const cancel = () => {
      deleteFixedEventGuest(eventId);
      closeModal();
      navigate(PathName.mainFixed);
      location.reload();
    };

    openDialog({
      title: `'${eventTitle}'\n미팅 카드를 삭제 하시겠어요?`,
      description:
        '삭제 시, 되돌리기 어려우며\n다가오는 미팅 목록에서 사라집니다.',
      onConfirm: cancel,
    });
  };

  const handleJoinClick = () => {
    const join = () => {
      putFixedEventGuestById(eventId);
      location.reload();
    };

    openDialog({
      title: `'${eventTitle}'\n미팅에 참여하시겠어요?`,
      onConfirm: join,
    });
  };

  const handleCopyLinkClick = () => {
    copyText(
      `${CURRENT_HOST}${PathName.invite}/${eventId}/invitation`,
      '케줄러링크가'
    );
  };

  let canceledFixedGuest = false;
  if (isFixedEvent(event) && hostId !== getCurrentUserInfo()?.userId) {
    canceledFixedGuest =
      event.participants.filter(
        (guest) => guest.userId === getCurrentUserInfo()?.userId
      )[0].userStatus === 'Declined';
  }

  const eventDate = useMemo(() => {
    if (isFixedEvent(event)) {
      return event.eventTimeStartsAt;
    }
    return undefined;
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
            eventDate={eventDate}
            event={event}
            isCanceled={isCanceled}
            isPassed={isPassed}
            setIsSaveAvailable={setIsSaveAvailable}
          />
        ) : (
          <OverviewBody
            eventDate={eventDate}
            event={event}
            isCanceled={isCanceled}
            isPassed={isPassed}
          />
        )}
      </div>
      {
        <footer className={'overview-footer'}>
          {!isPassed &&
            !isCanceled &&
            (isEdit ? (
              <>
                <OverviewButton
                  disabled={!isSaveAvailable}
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
                      icon={<CloseThinIcon />}
                      onClick={handleCancelHostClick}
                      text={'미팅취소'}
                    />
                  </>
                ) : isFixedEvent(event) ? (
                  isAccepted ? (
                    <OverviewButton
                      icon={<CancelIcon />}
                      onClick={handleCancelGuestFixedClick}
                      text={'참여취소'}
                    />
                  ) : (
                    <OverviewButton
                      className={'canceled'}
                      icon={<JoinIcon />}
                      onClick={handleJoinClick}
                      text={'참여하기'}
                    />
                  )
                ) : (
                  <OverviewButton
                    icon={<CancelIcon />}
                    onClick={handleCancelGuestPendingClick}
                    text={'참여취소'}
                  />
                )}
                {!canceledFixedGuest && (
                  <OverviewButton
                    icon={<LinkIcon />}
                    onClick={handleCopyLinkClick}
                    text={'케줄러링크 복사'}
                  />
                )}
              </>
            ))}
          {(isPassed || isCanceled || canceledFixedGuest) && (
            <OverviewButton
              className={'canceled'}
              icon={<DeleteIcon />}
              onClick={
                isHost
                  ? handleDeleteHostClick
                  : isFixedEvent(event)
                  ? handleDeleteGuestClick
                  : handleCancelGuestPendingClick
              }
              text={'미팅 삭제'}
            />
          )}
        </footer>
      }
    </div>
  );
}

export default Overview;
