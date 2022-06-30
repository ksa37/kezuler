import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { dialogAction } from 'src/reducers/dialog';
import { AppDispatch } from 'src/store';
import { PPatchUser } from 'src/types/user';

import { patchUser } from 'src/api/user';

const usePatchUser = () => {
  const [loading, setLoading] = useState(false);
  const { show } = dialogAction;
  const dispatch = useDispatch<AppDispatch>();

  const changeUser = (
    pPatchUser: PPatchUser,
    callbacks?: {
      onSuccess?: () => void;
      onError?: () => void;
    }
  ) => {
    setLoading(true);
    patchUser(pPatchUser)
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
