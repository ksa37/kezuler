import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { getUserInfoThunk } from 'src/reducers/UserInfo';
import { AppDispatch } from 'src/store';

const useGetUserInfo = () => {
  const dispatch = useDispatch<AppDispatch>();

  const getUserInfo = useCallback(
    (params?: { onFinally?: () => void }) => {
      return dispatch(getUserInfoThunk({ onFinally: params?.onFinally }));
    },
    [dispatch]
  );

  return { getUserInfo };
};

export default useGetUserInfo;
