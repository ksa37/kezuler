import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { CURRENT_HOST } from 'src/constants/Auth';
import PathName from 'src/constants/PathName';
import { acceptMeetingActions } from 'src/reducers/AcceptMeeting';
import { confirmTimeActions } from 'src/reducers/ConfirmTime';
import { createMeetingActions } from 'src/reducers/CreateMeeting';
import { AppDispatch } from 'src/store';
import {
  PDeletePendingEvent,
  PPostPendingEvent,
  PPutPendingEvent,
} from 'src/types/pendingEvent';

import { getInvitationById } from 'src/api/invitation';
import {
  deletePendingEventById,
  deletePendingEventGuestById,
  getPendingEventById,
  postPendingEvent,
  putPendingEventGuestById,
} from 'src/api/pendingEvent';

const useGetPendingEvent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const setAcceptPendingEvent = acceptMeetingActions.setPendingEvent;
  const setConfirmPendingEvent = confirmTimeActions.setPendingEvent;

  const getPendingEventInfo = (eventId: string, setOption: number) => {
    getPendingEventById(eventId)
      .then((res) => {
        switch (setOption) {
          case 0: {
            dispatch(setAcceptPendingEvent(res.data));
            break;
          }
          case 1: {
            dispatch(setConfirmPendingEvent(res.data));
            break;
          }
          default: {
            console.log('error');
          }
        }
      })
      .catch((err) => {
        console.log('미팅 수락 에러', err);
        window.alert('미팅 정보를 받아올 수 없습니다');
        navigate(PathName.invite + `/${eventId}`, { replace: true });
      });
  };

  return getPendingEventInfo;
};

const useGetInvitation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const setIsLoaded = acceptMeetingActions.setIsLoaded;
  const setAcceptPendingEvent = acceptMeetingActions.setPendingEvent;

  const getPendingEventInfo = (eventId: string) => {
    getInvitationById(eventId)
      .then((res) => {
        dispatch(setAcceptPendingEvent(res.data));
        dispatch(setIsLoaded(true));
      })
      .catch((err) => {
        console.log('미팅 수락 에러', err);
        window.alert('미팅 정보를 받아올 수 없습니다');
        navigate(PathName.invite + `/${eventId}`, { replace: true });
      });
  };

  return getPendingEventInfo;
};

const useDeletePendingEventById = () => {
  const removePendingEvent = (eventId: string) => {
    deletePendingEventById(eventId)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log('미팅 삭제 에러', err);
        window.alert('미팅 삭제 과정 중 오류가 생겼습니다');
      });
  };

  return removePendingEvent;
};

const usePostPendingEvent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { increaseStep, setShareUrl, setEventId } = createMeetingActions;

  const getShareUrl = (ppendingEvent: PPostPendingEvent) => {
    console.log(ppendingEvent);
    postPendingEvent(ppendingEvent)
      .then((res) => {
        dispatch(
          setShareUrl(`${CURRENT_HOST}${PathName.invite}/${res.data.eventId}`)
        );
        dispatch(setEventId(res.data.eventId));
        dispatch(increaseStep());
      })
      .catch((err) => {
        console.log('미팅 생성 에러', err);
        window.alert('미팅 생성 과정 중 오류가 생겼습니다');
        navigate(PathName.create, { replace: true });
      });
  };
  return getShareUrl;
};

const usePutPendingEventGuest = () => {
  const navigate = useNavigate();

  const putEventTimeCandidate = (
    eventId: string,
    ppendingEvent: PPutPendingEvent
  ) => {
    putPendingEventGuestById(eventId, ppendingEvent)
      .then((res) => {
        console.log(res.data);
        //
      })
      .catch((err) => {
        console.log('미팅 수락/수정 에러', err);
        window.alert('미팅 수락/수정 과정 중 오류가 생겼습니다');
        navigate(`${PathName.invite}/${eventId}`, { replace: true });
      });
  };
  return putEventTimeCandidate;
};

const useDeletePendingEventGuest = () => {
  //TODO
  const deleteEventTimeCandidate = (
    eventId: string,
    ppendingEvent?: PDeletePendingEvent
  ) => {
    if (ppendingEvent) {
      deletePendingEventGuestById(eventId, ppendingEvent);
    } else {
      deletePendingEventGuestById(eventId);
    }
  };
  return deleteEventTimeCandidate;
};

export {
  useGetPendingEvent,
  usePostPendingEvent,
  useDeletePendingEventById,
  usePutPendingEventGuest,
  useDeletePendingEventGuest,
  useGetInvitation,
};
