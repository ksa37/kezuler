import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { CURRENT_HOST } from 'src/constants/Auth';
import PathName from 'src/constants/PathName';
import { acceptMeetingActions } from 'src/reducers/AcceptMeeting';
import { alertAction } from 'src/reducers/alert';
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
  deletePendingEventCandidateById,
  getPendingEventById,
  postPendingEvent,
  putPendingEventCandidateById,
} from 'src/api/pendingEvent';

// 시간 확정시 정보 불러오기
const useGetPendingEvent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { show } = alertAction;
  const setConfirmPendingEvent = confirmTimeActions.setPendingEvent;

  const getPendingEventInfo = (eventId: string) => {
    getPendingEventById(eventId)
      .then((res) => {
        dispatch(setConfirmPendingEvent(res.data.result));
      })
      .catch((err) => {
        console.log('미팅 정보 불러오기 에러', err);
        dispatch(
          show({
            title: '참여 오류',
            description: '미팅 정보를 불러올 수 없습니다.',
          })
        );
        navigate(PathName.mainPending);
      });
  };

  return getPendingEventInfo;
};

// 미팅 수락, 수정시 정보 불러오기
const useGetInvitation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { show } = alertAction;
  const setIsLoaded = acceptMeetingActions.setIsLoaded;
  const setAcceptPendingEvent = acceptMeetingActions.setPendingEvent;

  const getPendingEventInfo = (eventId: string) => {
    getInvitationById(eventId)
      .then((res) => {
        dispatch(setAcceptPendingEvent(res.data.result));
        dispatch(setIsLoaded(true));
      })
      .catch((err) => {
        console.log('미팅 정보 불러오기 에러', err);
        dispatch(
          show({
            title: '참여 오류',
            description: '미팅 정보를 불러올 수 없습니다.',
          })
        );
        navigate(PathName.mainPending);
      });
  };

  return getPendingEventInfo;
};

const usePostPendingEvent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { setShareUrl, setEventId } = createMeetingActions;
  const { show } = alertAction;

  const getShareUrl = (ppendingEvent: PPostPendingEvent) => {
    postPendingEvent(ppendingEvent)
      .then((res) => {
        dispatch(
          setShareUrl(
            `${CURRENT_HOST}${PathName.invite}/${res.data.result.eventId}/invitation`
          )
        );
        dispatch(setEventId(res.data.result.eventId));
        navigate(PathName.createComplete);
      })
      .catch((err) => {
        console.log('미팅 생성 에러', err);
        dispatch(
          show({
            title: '미팅 생성 오류',
            description: '미팅을 생성할 수 없습니다.',
          })
        );
        navigate(PathName.create, { replace: true });
      });
  };
  return getShareUrl;
};

const usePutPendingEventGuest = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { show } = alertAction;

  const putEventTimeCandidate = (
    eventId: string,
    ppendingEvent: PPutPendingEvent
  ) => {
    putPendingEventCandidateById(eventId, ppendingEvent).catch((err) => {
      console.log('미팅 수락/수정 에러', err);
      dispatch(
        show({
          title: '미팅 참여 오류',
          description: '미팅 참여 과정 중 오류가 생겼습니다.',
        })
      );
      navigate(`${PathName.invite}/${eventId}/invitation`, { replace: true });
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
      deletePendingEventCandidateById(eventId, ppendingEvent);
    } else {
      deletePendingEventCandidateById(eventId);
    }
  };
  return deleteEventTimeCandidate;
};

export {
  useGetPendingEvent,
  usePostPendingEvent,
  usePutPendingEventGuest,
  useDeletePendingEventGuest,
  useGetInvitation,
};
