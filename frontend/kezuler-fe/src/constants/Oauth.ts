// const CURRENT_HOST = 'http://localhost:3000';

const CLIENT_ID = '0c7841de042de4b73e3a11c1af2f6671';
const REDIRECT_URI = 'http://localhost:8001/oauth/kakao/token';
// const SERVER_URI

const SERVER_URI =
  'https://efb4a784-1e8c-4296-8029-3fb7a7262580.mock.pstmn.io/';

const KAKAO_BASE_URL = 'https://kauth.kakao.com/oauth';
const KAKAO_AUTH_URL = `${KAKAO_BASE_URL}/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;

export { CLIENT_ID, REDIRECT_URI, SERVER_URI, KAKAO_BASE_URL, KAKAO_AUTH_URL };
