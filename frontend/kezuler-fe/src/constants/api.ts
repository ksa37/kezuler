import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { deleteCookie, getCookie, setCookie } from '../utils/cookie';

import { postRefresh } from '../api/user';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from './Auth';

const HOST_ADDRESS = 'http://54.180.134.149:8082';
const HOST_TEST_ADDRESS = 'http://54.180.134.149:8082';

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

// refresh token 을 통해 access token 재발급
const renew = (config: AxiosRequestConfig) => {
  const refreshToken = getCookie(REFRESH_TOKEN_KEY);

  postRefresh(refreshToken)
    .then((res) => {
      const {
        accessToken,
        accessTokenExpiresIn,
        refreshToken,
        refreshTokenExpiresIn,
      } = res.data.result;

      setCookie(ACCESS_TOKEN_KEY, accessToken, accessTokenExpiresIn);
      setCookie(REFRESH_TOKEN_KEY, refreshToken, refreshTokenExpiresIn);

      KezulerInstance.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${accessToken}`;

      if (config.headers) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }

      return axios(config);
    })
    .catch(() => {
      // Refresh API 는 실패하면 항상 로그아웃
      deleteCookie(ACCESS_TOKEN_KEY);
      deleteCookie(REFRESH_TOKEN_KEY);
      localStorage.clear();
      window.location.reload();
    });
};

KezulerInstance.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    const { config, response } = err;
    if (response?.status === UNAUTHORIZED_STATUS_CODE) {
      renew(config);
    }
    return Promise.reject(err);
  }
);

export { HOST_ADDRESS, HOST_TEST_ADDRESS, UNAUTHORIZED_STATUS_CODE };
export default KezulerInstance;
