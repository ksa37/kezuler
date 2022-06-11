import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { CURRENT_HOST } from 'src/constants/Auth';
import PathName from 'src/constants/PathName';
import { acceptMeetingActions } from 'src/reducers/AcceptMeeting';
import { createMeetingActions } from 'src/reducers/CreateMeeting';
import { AppDispatch } from 'src/store';
import { PPostPendingEvent } from 'src/types/pendingEvent';

import { getPendingEventsById, postPendingEvent } from 'src/api/pendingEvent';

const useGetPendingEvent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { setPendingEvent } = acceptMeetingActions;

  const getPendingEventInfo = (eventId: string) => {
    getPendingEventsById(eventId)
      .then((res) => {
        dispatch(setPendingEvent(res.data));
      })
      .catch((err) => {
        console.log('미팅 수락 에러', err);
        window.alert('미팅 정보를 받아올 수 없습니다');
        navigate(PathName.invite + `/${eventId}`, { replace: true });
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

export { useGetPendingEvent, usePostPendingEvent };
