import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import KezulerInstance from '../constants/api';
import {
  ACCESS_TOKEN_KEY,
  CURRENT_USER_INFO_KEY,
  REFRESH_TOKEN_KEY,
} from '../constants/Auth';
import PathName from 'src/constants/PathName';
import { dialogAction } from 'src/reducers/dialog';
import { AppDispatch } from 'src/store';
import { setCookie } from '../utils/cookie';

import { getKakaoAccessTokenApi } from 'src/api/Login';
import { postUser } from 'src/api/user';

const useKakaoLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { show } = dialogAction;
  // 리다이렉트 후 토큰 요청
  const getKakaoToken = (code: string, path: PathName) => {
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

            navigate(path, { replace: true });
          })
          .catch((e) => {
            console.log('소셜로그인 에러', e);
            dispatch(
              show({
                title: '카카오 로그인 오류',
                description: '로그인 과정 중 오류가 생겼습니다.',
              })
            );
            // navigate(PathName.login, { replace: true });
          });
      })
      .catch((err) => {
        console.log('소셜로그인 에러', err);
        dispatch(
          show({
            title: '카카오 로그인 오류',
            description: '로그인 과정 중 오류가 생겼습니다.',
          })
        );
        // navigate(PathName.login, { replace: true });
      });
  };

  return { getKakaoToken };
};

export default useKakaoLogin;
