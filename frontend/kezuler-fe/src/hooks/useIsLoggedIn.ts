import { useMemo } from 'react';

import { CURRENT_USER_INFO_KEY, REFRESH_TOKEN_KEY } from 'src/constants/Auth';
import { getCookie } from 'src/utils/cookie';

const useIsLoggedIn = () => {
  return useMemo(
    () =>
      !!getCookie(REFRESH_TOKEN_KEY) &&
      !!localStorage.getItem(CURRENT_USER_INFO_KEY),
    []
  );
};

export default useIsLoggedIn;
