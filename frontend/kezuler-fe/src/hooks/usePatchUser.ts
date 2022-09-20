import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AxiosResponse } from 'axios';

import { alertAction } from 'src/reducers/alert';
import { AppDispatch } from 'src/store';
import { RSettingUser } from 'src/types/user';

import {} from 'src/api/user';

const usePatchUser = () => {
  const [loading, setLoading] = useState(false);
  const { show } = alertAction;
  const dispatch = useDispatch<AppDispatch>();

  const changeUser = (
    changeProfileFunc: Promise<AxiosResponse<RSettingUser, any>>,
    callbacks?: {
      onSuccess?: () => void;
      onError?: () => void;
    }
  ) => {
    setLoading(true);
    changeProfileFunc
      .then(() => {
        callbacks?.onSuccess?.();
      })
      .catch(() => {
        callbacks?.onError?.();
        dispatch(show({ title: '유저 정보 수정중 오류가 생겼습니다' }));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { changeUser, loading };
};

export { usePatchUser };
