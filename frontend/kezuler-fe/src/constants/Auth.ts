const CURRENT_HOST = 'http://localhost:3000';

const CLIENT_ID = '0c7841de042de4b73e3a11c1af2f6671';
const REDIRECT_URI = 'http://localhost:3000/oauth/kakao/token';

const KAKAO_BASE_URL = 'https://kauth.kakao.com/oauth';
const KAKAO_AUTH_URL = `${KAKAO_BASE_URL}/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;

const CURRENT_USER_INFO_KEY = 'CURRENT_USER_INFO';
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const LOGIN_REDIRECT_KEY = 'LOGIN_REDIRECT';

export {
  CURRENT_HOST,
  CLIENT_ID,
  REDIRECT_URI,
  KAKAO_BASE_URL,
  KAKAO_AUTH_URL,
  CURRENT_USER_INFO_KEY,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  LOGIN_REDIRECT_KEY,
};
