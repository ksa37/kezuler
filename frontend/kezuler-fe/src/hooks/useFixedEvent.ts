import { useNavigate } from 'react-router-dom';

import PathName from 'src/constants/PathName';
import { PPostFixedEvent } from 'src/types/fixedEvent';

import { postFixedEvent } from 'src/api/fixedEvent';

const usePostFixedEvent = () => {
  const navigate = useNavigate();

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
        window.alert('미팅 확정 과정 중 오류가 생겼습니다');
        navigate(`${PathName.confirm}:/${eventId}`, { replace: true });
      });
  };
  return postFixedEventByConfirm;
};

export { usePostFixedEvent };
