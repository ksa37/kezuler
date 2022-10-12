import axios from 'axios';

import {
  CLIENT_ID,
  GOOGLE_BASE_URL,
  GOOGLE_CLIENT_ID,
  KAKAO_BASE_URL,
  REDIRECT_URI,
} from 'src/constants/Auth';
import { RGoogleAccessToken, RKakaoAccessToken } from 'src/types/login';

const getKakaoAccessTokenApi = (code: string) => {
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', CLIENT_ID);
  params.append('redirect_uri', REDIRECT_URI);
  params.append('code', code);

  return axios.post<RKakaoAccessToken>(`${KAKAO_BASE_URL}/token`, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

const getGoogleTokenApi = (code: string, redirect_uri: string) => {
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', GOOGLE_CLIENT_ID);
  // params.append('client_secret', GOOGLE_SECRET);
  params.append('redirect_uri', redirect_uri);
  params.append('code', code);
  console.log(params);
  return axios.post<RGoogleAccessToken>(`${GOOGLE_BASE_URL}/token`, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
};

export { getKakaoAccessTokenApi, getGoogleTokenApi };
