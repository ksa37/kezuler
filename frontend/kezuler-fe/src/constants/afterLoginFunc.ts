import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { alertAction } from 'src/reducers/alert';
import { AppDispatch } from 'src/store';

import PathName from './PathName';

import { putFixedEventGuestById } from 'src/api/fixedEvent';

const joinFixedMeeting = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { show } = alertAction;

  const joinFixedMeetingFunc = (eventId: string) => {
    putFixedEventGuestById(eventId)
      .then(() => {
        navigate(`${PathName.invite}/${eventId}/completeFixed`);
      })
      .catch((err) => {
        console.log('미팅 참여 에러', err);
        dispatch(
          show({
            title: '미팅 참여 오류',
            description: '미팅 참여 과정 중 오류가 생겼습니다.',
          })
        );
      });
  };
  return joinFixedMeetingFunc;
};
interface AfterLoginFuncObj {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [key: string]: Function;
}

const afterLoginFuncObj: AfterLoginFuncObj = {
  joinFixedMeeting: joinFixedMeeting(),
};

export { afterLoginFuncObj };
