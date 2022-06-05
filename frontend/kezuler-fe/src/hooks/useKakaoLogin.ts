import { useNavigate } from 'react-router-dom';

import KezulerInstance from '../constants/api';
import {
  ACCESS_TOKEN_KEY,
  CURRENT_USER_INFO_KEY,
  REFRESH_TOKEN_KEY,
} from '../constants/Auth';
import PathName from 'src/constants/PathName';
import { setCookie } from '../utils/cookie';

import { getKakaoAccessTokenApi } from 'src/api/Login';
import { postUser } from 'src/api/user';

const useKakaoLogin = () => {
  const navigate = useNavigate();

  // 리다이렉트 후 토큰 요청
  const getKakaoToken = (code: string) => {
    getKakaoAccessTokenApi(code)
      .then((getRes) => {
        const accessToken = getRes.data.access_token;

        postUser(accessToken)
          .then((res) => {
            const {
              userToken: {
                accessToken,
                refreshToken,
                accessTokenExpiresIn,
                refreshTokenExpiresIn,
              },
              ...userInfo
            } = res.data;

            localStorage.setItem(
              CURRENT_USER_INFO_KEY,
              JSON.stringify(userInfo)
            );
            setCookie(ACCESS_TOKEN_KEY, accessToken, accessTokenExpiresIn);
            setCookie(REFRESH_TOKEN_KEY, refreshToken, refreshTokenExpiresIn);
            // axios 인스턴스 헤더에 토큰 삽입
            KezulerInstance.defaults.headers.common['Authorization'] =
              accessToken;

            navigate(PathName.main, { replace: true });
          })
          .catch((e) => {
            console.log('소셜로그인 에러', e);
            window.alert('로그인에 실패하였습니다.');
            // navigate(PathName.login, { replace: true });
          });
      })
      .catch((err) => {
        console.log('소셜로그인 에러', err);
        window.alert('로그인에 실패하였습니다.');
        // navigate(PathName.login, { replace: true });
      });
  };

  return { getKakaoToken };
};

export default useKakaoLogin;
