import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { CURRENT_HOST } from 'src/constants/Auth';
import PathName from 'src/constants/PathName';
import { acceptMeetingActions } from 'src/reducers/AcceptMeeting';
import { confirmTimeActions } from 'src/reducers/ConfirmTime';
import { createMeetingActions } from 'src/reducers/CreateMeeting';
import { modifySelectionActions } from 'src/reducers/ModifySelection';
import { AppDispatch } from 'src/store';
import { PPostPendingEvent, PPutPendingEvent } from 'src/types/pendingEvent';

import {
  getPendingEventsById,
  postPendingEvent,
  putPendingEventGuestById,
} from 'src/api/pendingEvent';

const useGetPendingEvent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const setAcceptPendingEvent = acceptMeetingActions.setPendingEvent;
  const setConfirmPendingEvent = confirmTimeActions.setPendingEvent;
  const setModifyPendingEvent = modifySelectionActions.setPendingEvent;

  const getPendingEventInfo = (eventId: string, setOption: number) => {
    getPendingEventsById(eventId)
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
          case 2: {
            dispatch(setModifyPendingEvent(res.data));
            break;
          }
          default: {
            console.log('error');
          }
        }
      })
      .catch((err) => {
        console.log('미팅 수락 에러', err);
        // window.alert('미팅 정보를 받아올 수 없습니다');
        // navigate(PathName.invite + `/${eventId}`, { replace: true });
      });
  };

  return getPendingEventInfo;
};

const usePostPendingEvent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { increaseStep, setShareUrl } = createMeetingActions;

  const getShareUrl = (ppendingEvent: PPostPendingEvent) => {
    postPendingEvent(ppendingEvent)
      .then((res) => {
        dispatch(
          setShareUrl(`${CURRENT_HOST}${PathName.invite}/${res.data.eventId}`)
        );
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
  const dispatch = useDispatch<AppDispatch>();
  const { increaseStep } = acceptMeetingActions;

  const putEventTimeCandidate = (
    eventId: string,
    ppendingEvent: PPutPendingEvent
  ) => {
    putPendingEventGuestById(eventId, ppendingEvent)
      .then((res) => {
        console.log(res.data);
        dispatch(increaseStep());
      })
      .catch((err) => {
        console.log('미팅 수락 에러', err);
        window.alert('미팅 수락 과정 중 오류가 생겼습니다');
        navigate(`${PathName.invite}/${eventId}`, { replace: true });
      });
  };
  return putEventTimeCandidate;
};

export { useGetPendingEvent, usePostPendingEvent, usePutPendingEventGuest };
