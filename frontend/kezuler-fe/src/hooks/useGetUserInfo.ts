import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'src/reducers';
import { getUserInfoThunk } from 'src/reducers/UserInfo';
import { AppDispatch } from 'src/store';

const useGetHostInfo = () => {
  const { userId, userName, userProfileImage } = useSelector(
    (state: RootState) => state.userInfo
  );
  const dispatch = useDispatch<AppDispatch>();

  const getUserInfo = useCallback(
    (userId: string, onFullFilled: () => void) => {
      return dispatch(getUserInfoThunk({ userId, onFullFilled }));
    },
    [dispatch]
  );

  return { getUserInfo, userId, userName, userProfileImage };
};

export default useGetHostInfo;
