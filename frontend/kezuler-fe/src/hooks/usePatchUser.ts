import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { alertAction } from 'src/reducers/alert';
import { AppDispatch } from 'src/store';
import { PPatchUser } from 'src/types/user';

import { patchUser, patchUserProfileImage } from 'src/api/user';

const usePatchUser = () => {
  const [loading, setLoading] = useState(false);
  const { show } = alertAction;
  const dispatch = useDispatch<AppDispatch>();

  const changeUser = (
    pPatchUser: PPatchUser,
    callbacks?: {
      onSuccess?: () => void;
      onError?: () => void;
    }
  ) => {
    setLoading(true);

    const { userProfileImage, ...patchParams } = pPatchUser;

    const apiList = [];
    if (Object.keys(patchParams).length > 0) {
      apiList.push(patchUser(patchParams));
    }
    if (userProfileImage) {
      apiList.push(patchUserProfileImage(userProfileImage));
    }

    Promise.all(apiList)
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
