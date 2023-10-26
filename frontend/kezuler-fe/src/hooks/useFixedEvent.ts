import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import PathName from 'src/constants/PathName';
import { alertAction } from 'src/reducers/alert';
import { AppDispatch } from 'src/store';
import { PPostFixedEvent } from 'src/types/fixedEvent';

import { postFixedEvent } from 'src/api/fixedEvent';

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

export { usePostFixedEvent };
