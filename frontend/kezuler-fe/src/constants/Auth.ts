const CLIENT_ID = '0c7841de042de4b73e3a11c1af2f6671';
const GOOGLE_CLIENT_ID =
  '40603094782-sonac05jc2aumk75mug0949lfdiqivn0.apps.googleusercontent.com';

const GOOGLE_LOGIN_SCOPE =
  'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.email';

const CURRENT_HOST = window.location.origin;
const REDIRECT_URI = `${window.location.origin}/oauth/kakao/token`;

const KAKAO_BASE_URL = 'https://kauth.kakao.com/oauth';
const KAKAO_AUTH_URL = `${KAKAO_BASE_URL}/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;

const GOOGLE_BASE_URL = 'https://oauth2.googleapis.com';

const CURRENT_USER_INFO_KEY = 'CURRENT_USER_INFO';
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const LOGIN_REDIRECT_KEY = 'LOGIN_REDIRECT';
const AFTER_LOGIN_FUNC_KEY = 'AFTER_LOGIN_FUNC';

export {
  CURRENT_HOST,
  REDIRECT_URI,
  CLIENT_ID,
  KAKAO_BASE_URL,
  KAKAO_AUTH_URL,
  CURRENT_USER_INFO_KEY,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  LOGIN_REDIRECT_KEY,
  GOOGLE_CLIENT_ID,
  GOOGLE_LOGIN_SCOPE,
  GOOGLE_BASE_URL,
  AFTER_LOGIN_FUNC_KEY,
};
