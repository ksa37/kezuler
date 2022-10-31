import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

import { CURRENT_HOST, GOOGLE_LOGIN_SCOPE } from 'src/constants/Auth';
import { OVERVIEW_FORM_ID } from 'src/constants/Main';
import PathName, {
  makeFixedInfoUrl,
  makePendingInfoUrl,
} from 'src/constants/PathName';
import useCopyText from 'src/hooks/useCopyText';
import useDialog from 'src/hooks/useDialog';
import useGetUserInfo from 'src/hooks/useGetUserInfo';
import useLoading from 'src/hooks/useLoading';
import { usePatchUser } from 'src/hooks/usePatchUser';
import { RootState } from 'src/reducers';
import { alertAction } from 'src/reducers/alert';
import { AppDispatch } from 'src/store';
import { BFixedEvent } from 'src/types/fixedEvent';
import { BPendingEvent } from 'src/types/pendingEvent';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';
import getTimezoneDate from 'src/utils/getTimezoneDate';
import { isFixedEvent } from 'src/utils/typeGuard';

import OverviewBody from './OverviewBody';
import OverviewButton from './OverviewButton';
import OverviewEdit from './OverviewEdit';

import { ReactComponent as GoogleIcon } from 'src/assets/google_icon.svg';
import { ReactComponent as CancelIcon } from 'src/assets/icn_cancel.svg';
import { ReactComponent as CheckIcon } from 'src/assets/icn_check.svg';
import { ReactComponent as CloseIcon } from 'src/assets/icn_close_b.svg';
import { ReactComponent as CloseThinIcon } from 'src/assets/icn_close_thin.svg';
import { ReactComponent as DeleteIcon } from 'src/assets/icn_delete.svg';
import { ReactComponent as EditIcon } from 'src/assets/icn_edit_big.svg';
import { ReactComponent as JoinIcon } from 'src/assets/icn_join.svg';
import { ReactComponent as LinkIcon } from 'src/assets/icn_link.svg';

import { getGoogleAccount } from 'src/api/calendar';
import {
  cancelFixedEventGuestById,
  cancelFixedEventHostById,
  deleteFixedEventGuestById,
  deleteFixedEventHostById,
  putFixedEventGuestById,
} from 'src/api/fixedEvent';
import {
  cancelPendingEventGuestById,
  cancelPendingEventHostById,
  deletePendingEventHostById,
} from 'src/api/pendingEvent';

function Overview() {
  const { startLoading, endLoading } = useLoading();

  const { eventId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { show } = alertAction;
  const [isSaveAvailable, setIsSaveAvailable] = useState(true);
  const { googleToggle } = useMemo(() => ({ ...getCurrentUserInfo() }), []);

  const isFixedMeeting = location.pathname.startsWith(PathName.mainFixed);

  const { changeUser, loading } = usePatchUser();
  const { getUserInfo } = useGetUserInfo();

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

  const handleCancelHostClick = () => {
    const cancelFixedMeetingHost = () => {
      startLoading();
      cancelFixedEventHostById(eventId)
        .then(() => {
          location.reload();
        })
        .catch((err) => {
          endLoading();
          console.log('미팅 취소 에러', err);
          dispatch(
            show({
              title: '미팅 취소 오류',
              description: '미팅 취소 과정 중 오류가 생겼습니다.',
            })
          );
        });
    };

    const cancelPendingMeetingHost = () => {
      startLoading();
      cancelPendingEventHostById(eventId)
        .then(() => {
          location.reload();
        })
        .catch((err) => {
          endLoading();
          console.log('미팅 취소 에러', err);
          dispatch(
            show({
              title: '미팅 취소 오류',
              description: '미팅 취소 과정 중 오류가 생겼습니다.',
            })
          );
        });
    };

    openDialog({
      title: `'${eventTitle}'\n미팅을 취소 하시겠어요?`,
      description:
        '취소 시, 되돌리기 어려우며\n참여자들에게 카카오톡 메세지가 전송됩니다.',
      onConfirm: isFixedEvent(event)
        ? cancelFixedMeetingHost
        : cancelPendingMeetingHost,
    });
  };

  const handleDeleteHostClick = () => {
    const deleteFixedMeetingHost = () => {
      startLoading();
      deleteFixedEventHostById(eventId)
        .then(() => {
          closeModal();
          navigate(PathName.mainFixed);
          location.reload();
        })
        .catch((err) => {
          endLoading();
          console.log('미팅 삭제 에러', err);
          dispatch(
            show({
              title: '미팅 삭제 오류',
              description: '미팅 삭제 과정 중 오류가 생겼습니다.',
            })
          );
        });
    };

    const deletePendingMeetingHost = () => {
      startLoading();
      deletePendingEventHostById(eventId)
        .then(() => {
          closeModal();
          navigate(PathName.mainPending);
          location.reload();
        })
        .catch((err) => {
          endLoading();
          console.log('미팅 삭제 에러', err);
          dispatch(
            show({
              title: '미팅 삭제 오류',
              description: '미팅 삭제 과정 중 오류가 생겼습니다.',
            })
          );
        });
    };

    openDialog({
      title: `'${eventTitle}'\n미팅카드를 삭제 하시겠어요?`,
      description:
        '삭제 시, 되돌리기 어려우며\n다가오는 미팅 목록에서 사라집니다.',
      onConfirm: isFixedEvent(event)
        ? deleteFixedMeetingHost
        : deletePendingMeetingHost,
    });
  };

  const handleCancelGuestFixedClick = () => {
    const cancel = () => {
      startLoading();
      cancelFixedEventGuestById(eventId)
        .then(() => {
          location.reload();
        })
        .catch((err) => {
          endLoading();
          console.log('미팅 취소 에러', err);
          dispatch(
            show({
              title: '미팅 취소 오류',
              description: '미팅 취소 과정 중 오류가 생겼습니다.',
            })
          );
        });
    };

    openDialog({
      title: `'${eventTitle}'\n미팅 참여를 취소 하시겠어요?`,
      onConfirm: cancel,
    });
  };

  const handleCancelGuestPendingClick = () => {
    const cancel = () => {
      startLoading();
      cancelPendingEventGuestById(eventId)
        .then(() => {
          closeModal();
          navigate(PathName.mainPending);
          location.reload();
        })
        .catch((err) => {
          endLoading();
          console.log('미팅카드 삭제 에러', err);
          dispatch(
            show({
              title: '미팅카드 삭제 오류',
              description: '미팅카드 삭제 과정 중 오류가 생겼습니다.',
            })
          );
        });
    };

    openDialog({
      title: `'${eventTitle}'\n미팅카드를 삭제 하시겠어요?`,
      description:
        '삭제 시, 되돌리기 어려우며\n투표중인 미팅 목록에서 사라집니다.',
      onConfirm: cancel,
    });
  };

  const handleDeleteGuestFixedClick = () => {
    const cancel = () => {
      startLoading();
      deleteFixedEventGuestById(eventId)
        .then(() => {
          closeModal();
          navigate(PathName.mainFixed);
          location.reload();
        })
        .catch((err) => {
          endLoading();
          console.log('미팅 삭제 에러', err);
          dispatch(
            show({
              title: '미팅 삭제 오류',
              description: '미팅 삭제 과정 중 오류가 생겼습니다.',
            })
          );
        });
    };

    openDialog({
      title: `'${eventTitle}'\n미팅카드를 삭제 하시겠어요?`,
      description:
        '삭제 시, 되돌리기 어려우며\n다가오는 미팅 목록에서 사라집니다.',
      onConfirm: cancel,
    });
  };

  const handleJoinGuestFixedClick = () => {
    const join = () => {
      startLoading();
      putFixedEventGuestById(eventId)
        .then(() => {
          location.reload();
        })
        .catch((err) => {
          endLoading();
          console.log('미팅 재참여 에러', err);
          dispatch(
            show({
              title: '미팅 재참여 오류',
              description: '미팅 재참여 과정 중 오류가 생겼습니다.',
            })
          );
        });
    };

    openDialog({
      title: `'${eventTitle}'\n미팅에 재참여하시겠어요?`,
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

  const [isCalendarPaired, setIsCalendarPaired] = useState(googleToggle);

  const handleGoogleSuccess = (res: any) => {
    changeUser(
      getGoogleAccount(res.code),
      {
        onSuccess: () => {
          getUserInfo();
          setIsCalendarPaired(!isCalendarPaired);
        },
      },
      true
    );
  };

  const connectGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    flow: 'auth-code',
    scope: GOOGLE_LOGIN_SCOPE,
  });

  const checkIos = () => {
    const Agent = navigator.userAgent;

    const checkIosPage = () => {
      const mobile = document.createElement('meta');
      mobile.name = 'viewport';
      mobile.content =
        'width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no, minimal-ui';
      document.getElementsByTagName('head')[0].appendChild(mobile);
      document.body.innerHTML =
        "<style>body{margin:0;padding:0;overflow: hidden;height: 100%;}</style><h2 style='padding-top:50px; text-align:center;'>인앱브라우저 호환문제로 인해<br />Safari로 접속해야합니다.</h2><article style='text-align:center; font-size:17px; word-break:keep-all;color:#999;'>아래 버튼을 눌러 Safari를 실행해주세요<br />Safari가 열리면, 주소창을 길게 터치한 뒤,<br />'붙여놓기 및 이동'을 누르면<br />정상적으로 이용할 수 있습니다.<br /><br /><button onclick='inappbrowserout();' style='min-width:180px;margin-top:10px;height:54px;font-weight: 700;background-color:#fad94f;color:#000;border-radius: 4px;font-size:17px;border:0;'>Safari로 열기</button></article><img style='width:70%;margin:50px 15% 0 15%' src='https://tistory3.daumcdn.net/tistory/1893869/skin/images/inappbrowserout.jpeg' />";
    };

    if (Agent.match(/iPhone|iPad/i)) {
      if (Agent.toLowerCase().includes('kakao')) {
        checkIosPage();
      } else if (Agent.toLowerCase().includes('naver')) {
        checkIosPage();
      } else if (Agent.includes('instagram')) {
        checkIosPage();
      } else {
        connectGoogle();
      }
    } else {
      connectGoogle();
    }
  };

  const handleGooglelogin = () => {
    openDialog({
      title: `구글 캘린더 연동`,
      description:
        '확정된 일정을 자동으로 등록하고,\n 일정을 확인해 중복 예약을 \n 방지할 수 있습니다.',
      onConfirm: checkIos,
    });
  };

  const handleConnectClick = () => {
    if (!googleToggle) {
      handleGooglelogin();
    }
  };

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
                      text={'정보 수정'}
                    />
                    <OverviewButton
                      icon={<CloseThinIcon />}
                      onClick={handleCancelHostClick}
                      text={'미팅 취소'}
                    />
                    {isFixedEvent(event) && (
                      <OverviewButton
                        icon={<GoogleIcon />}
                        onClick={handleConnectClick}
                        text={'내 캘린더에'}
                        textBtm={'추가하기'}
                      />
                    )}
                  </>
                ) : isFixedEvent(event) ? (
                  isAccepted ? (
                    <>
                      <OverviewButton
                        icon={<CancelIcon />}
                        onClick={handleCancelGuestFixedClick}
                        text={'참여 취소'}
                      />
                      <OverviewButton
                        icon={<GoogleIcon />}
                        onClick={handleConnectClick}
                        text={'내 캘린더에'}
                        textBtm={'추가하기'}
                      />
                    </>
                  ) : (
                    <OverviewButton
                      className={'canceled'}
                      icon={<JoinIcon />}
                      onClick={handleJoinGuestFixedClick}
                      text={'참여하기'}
                    />
                  )
                ) : (
                  <OverviewButton
                    icon={<CancelIcon />}
                    onClick={handleCancelGuestPendingClick}
                    text={'참여 취소'}
                  />
                )}
                {!isFixedEvent(event) && (
                  <OverviewButton
                    icon={<LinkIcon />}
                    onClick={handleCopyLinkClick}
                    text={'케줄러링크'}
                    textBtm={'복사'}
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
                  ? handleDeleteGuestFixedClick
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
