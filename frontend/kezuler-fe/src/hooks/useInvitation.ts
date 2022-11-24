import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import PathName from 'src/constants/PathName';
import { acceptMeetingActions } from 'src/reducers/AcceptMeeting';
import { alertAction } from 'src/reducers/alert';
import { AppDispatch } from 'src/store';
import { isFixedEvent } from 'src/utils/typeGuard';

import { getInvitationById } from 'src/api/invitation';

const useGetInvitation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { show } = alertAction;
  const { setIsLoaded, setFixedEvent, setPendingEvent } = acceptMeetingActions;

  const getEventInfo = (eventId: string) => {
    getInvitationById(eventId)
      .then((res) => {
        const event = res.data.result;
        if (isFixedEvent(event)) {
          dispatch(setFixedEvent(event));
        } else {
          dispatch(setPendingEvent(event));
        }

        dispatch(setIsLoaded(true));
      })
      .catch((err) => {
        console.log('미팅 정보 불러오기 에러', err);
        dispatch(
          show({
            title: '참여 불가 알림',
            description: '미팅이 확정되었거나 취소되어 참여가 불가합니다.',
          })
        );
        navigate(PathName.mainPending, { replace: true });
      });
  };

  return getEventInfo;
};

export { useGetInvitation };
