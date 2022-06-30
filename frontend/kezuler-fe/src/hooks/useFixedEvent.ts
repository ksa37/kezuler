import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import PathName from 'src/constants/PathName';
import { dialogAction } from 'src/reducers/dialog';
import { AppDispatch } from 'src/store';
import { PPostFixedEvent } from 'src/types/fixedEvent';

import { postFixedEvent } from 'src/api/fixedEvent';

const usePostFixedEvent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { show } = dialogAction;

  const postFixedEventByConfirm = (
    pfixedEvent: PPostFixedEvent,
    eventId: string
  ) => {
    postFixedEvent(pfixedEvent)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
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
