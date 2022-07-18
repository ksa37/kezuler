import { useDispatch } from 'react-redux';

import { dialogAction } from 'src/reducers/dialog';
import { AppDispatch } from 'src/store';
import { PPutReminder } from 'src/types/reminder';

import {
  deleteGuestReminder,
  getGuestReminder,
  postGuestReminder,
  putGuestReminder,
} from 'src/api/fixedEvent';

const useGetReminder = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { show } = dialogAction;

  const getReminder = (eventId: string) => {
    getGuestReminder(eventId)
      .then((res) => {
        return res.data;
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

const usePostReminder = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { show } = dialogAction;

  const postReminder = (eventId: string, param: PPutReminder) => {
    postGuestReminder(eventId, param)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log('리마인더 에러', err);
        dispatch(
          show({
            title: '리마인더 오류',
            description: '리마인더를 설정할수 없습니다.',
          })
        );
      });
  };
  return postReminder;
};

const usePutReminder = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { show } = dialogAction;

  const putReminder = (eventId: string, param: PPutReminder) => {
    putGuestReminder(eventId, param)
      .then((res) => {
        return res.data;
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

const useDeleteReminder = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { show } = dialogAction;

  const deleteReminder = (eventId: string) => {
    deleteGuestReminder(eventId)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log('리마인더 에러', err);
        dispatch(
          show({
            title: '리마인더 오류',
            description: '리마인더를 삭제할수 없습니다.',
          })
        );
      });
  };
  return deleteReminder;
};

export { useGetReminder, usePostReminder, usePutReminder, useDeleteReminder };
