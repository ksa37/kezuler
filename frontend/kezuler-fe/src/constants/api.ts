import axios from 'axios';

import { getCookie } from '../utils/cookie';

import { ACCESS_TOKEN_KEY } from './Auth';

// const HOST_ADDRESS = 'http://3.36.122.93:8082';
// const HOST_ADDRESS = 'https://api.kezuler.com';
const HOST_ADDRESS = 'https://nftmonster.kr';
// const HOST_TEST_ADDRESS = 'http://54.180.134.149:8082';

const UNAUTHORIZED_STATUS_CODE = 401;

const KezulerInstance = (() => {
  const accessToken = getCookie(ACCESS_TOKEN_KEY);

  return axios.create({
    baseURL: HOST_ADDRESS,
    ...(accessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // 'Content-Type': 'application/json',
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

export {
  HOST_ADDRESS,
  // HOST_TEST_ADDRESS,
  UNAUTHORIZED_STATUS_CODE,
  // KezulerTestInstance2,
};
export default KezulerInstance;
