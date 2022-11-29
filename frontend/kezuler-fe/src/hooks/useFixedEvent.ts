import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { CURRENT_HOST } from 'src/constants/Auth';
import PathName from 'src/constants/PathName';
import { alertAction } from 'src/reducers/alert';
import { createMeetingActions } from 'src/reducers/CreateMeeting';
import { AppDispatch } from 'src/store';
import { PPostFixedEvent, PPostFixedEventNew } from 'src/types/fixedEvent';

import { postFixedEvent, postFixedEventNew } from 'src/api/fixedEvent';

const useCreateFixedEvent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { setShareUrl, setEventId } = createMeetingActions;
  const { show } = alertAction;

  const getShareUrl = (pfixedEvent: PPostFixedEventNew) => {
    postFixedEventNew(pfixedEvent)
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

const usePostFixedEvent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { show } = alertAction;

  const postFixedEventByConfirm = (
    pfixedEvent: PPostFixedEvent,
    eventId: string
  ) => {
    postFixedEvent(pfixedEvent).catch((err) => {
      console.log('미팅 확정 에러', err);
      dispatch(
        show({
          title: '미팅 확정 오류',
          description: '미팅 확정 과정 중 오류가 생겼습니다.',
        })
      );
      navigate(`${PathName.confirm}:/${eventId}`, { replace: true });
    });
  };
  return postFixedEventByConfirm;
};

export { usePostFixedEvent, useCreateFixedEvent };
