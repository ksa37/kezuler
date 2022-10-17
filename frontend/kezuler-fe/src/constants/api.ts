import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { deleteCookie, getCookie, setCookie } from '../utils/cookie';

import { postRefresh } from '../api/user';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from './Auth';

const HOST_ADDRESS = 'https://api.kezuler.com';

const UNAUTHORIZED_STATUS_CODE = 401;
const FORBIDDEN_STATUS_CODE = 403;

const KezulerInstance = (() => {
  const instance = axios.create({
    baseURL: HOST_ADDRESS,
  });

  const accessToken = getCookie(ACCESS_TOKEN_KEY);
  if (accessToken) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  }

  return instance;
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
    const status = response?.status;
    if (
      status &&
      [UNAUTHORIZED_STATUS_CODE, FORBIDDEN_STATUS_CODE].includes(status)
    ) {
      renew(config);
    }
    return Promise.reject(err);
  }
);

export { HOST_ADDRESS };
export default KezulerInstance;
