import axios from 'axios';

import KezulerInstance from 'src/constants/api';
import { CLIENT_ID, KAKAO_BASE_URL, REDIRECT_URI } from 'src/constants/Oauth';
import { RKakaoToken } from 'src/types/login';

const getKakaoTokenApi = (code: string) =>
  axios.post<RKakaoToken>(`${KAKAO_BASE_URL}/token`, {
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    code,
  });

const postAccessTokenApi = (accessToken: string) =>
  KezulerInstance.post(`/token`, {
    accessToken,
  });

export { getKakaoTokenApi, postAccessTokenApi };
