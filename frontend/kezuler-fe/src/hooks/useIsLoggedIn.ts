import { useMemo } from 'react';

import { ACCESS_TOKEN_KEY, CURRENT_USER_INFO_KEY } from 'src/constants/Auth';
import { getCookie } from 'src/utils/cookie';

const useIsLoggedIn = () => {
  return useMemo(
    () =>
      !!getCookie(ACCESS_TOKEN_KEY) &&
      !!localStorage.getItem(CURRENT_USER_INFO_KEY),
    []
  );
};

export default useIsLoggedIn;
