import axios from 'axios';

import { getCookie } from '../utils/cookie';

import { ACCESS_TOKEN_KEY } from './Auth';

const HOST_ADDRESS =
  'https://efb4a784-1e8c-4296-8029-3fb7a7262580.mock.pstmn.io/';

const UNAUTHORIZED_STATUS_CODE = 401;

const KezulerInstance = (() => {
  const accessToken = getCookie(ACCESS_TOKEN_KEY);

  return axios.create({
    baseURL: HOST_ADDRESS,
    ...(accessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      : {}),
  });
})();

KezulerInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === UNAUTHORIZED_STATUS_CODE) {
      localStorage.clear();
      window.location.reload();
      return Promise.reject(err);
    }
    return Promise.reject(err);
  }
);

export { HOST_ADDRESS, UNAUTHORIZED_STATUS_CODE };
export default KezulerInstance;
