import { useDispatch } from 'react-redux';

import { alertAction } from 'src/reducers/alert';
import { AppDispatch } from 'src/store';
import { PPatchReminder } from 'src/types/reminder';

import { getGuestReminder, patchGuestReminder } from 'src/api/fixedEvent';

const useGetReminder = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { show } = alertAction;

  const getReminder = (eventId: string) => {
    getGuestReminder(eventId)
      .then((res) => {
        return res.data.result;
      })
      .catch((err) => {
        console.log('리마인더 에러', err);
        dispatch(
          show({
            title: '리마인더 오류',
            description: '리마인더를 가져올 수 없습니다.',
          })
        );
      });
  };
  return getReminder;
};

const usePatchReminder = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { show } = alertAction;

  const putReminder = (eventId: string, param: PPatchReminder) => {
    patchGuestReminder(eventId, param)
      .then((res) => {
        return res.data.result;
      })
      .catch((err) => {
        console.log('리마인더 에러', err);
        dispatch(
          show({
            title: '리마인더 오류',
            description: '리마인더를 바꿀수 없습니다.',
          })
        );
      });
  };
  return putReminder;
};

export { useGetReminder, usePatchReminder };
