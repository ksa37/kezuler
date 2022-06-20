import { useState } from 'react';

import { PPatchUser } from 'src/types/user';

import { patchUser } from 'src/api/user';

const usePatchUser = () => {
  const [loading, setLoading] = useState(false);

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
        alert('유저 정보 수정중 오류가 생겼습니다');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { changeUser, loading };
};

export { usePatchUser };
