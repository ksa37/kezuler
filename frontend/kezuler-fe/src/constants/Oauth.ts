const CURRENT_HOST = 'http://localhost:3000';

const CLIENT_ID = '0c7841de042de4b73e3a11c1af2f6671';
const REDIRECT_URI = `${CURRENT_HOST}/oauth/kakao/token`;
// const SERVER_URI

export const SERVER_URI = 'mclkdslsm';
export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
