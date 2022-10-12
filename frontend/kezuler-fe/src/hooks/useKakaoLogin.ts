import { useDispatch } from 'react-redux';

// import { useNavigate } from 'react-router-dom';
import KezulerInstance from '../constants/api';
import {
  ACCESS_TOKEN_KEY,
  CURRENT_HOST,
  CURRENT_USER_INFO_KEY,
  REFRESH_TOKEN_KEY,
} from '../constants/Auth';
import PathName from 'src/constants/PathName';
import { alertAction } from 'src/reducers/alert';
import { AppDispatch } from 'src/store';
import { PPostGoogleToken, RGoogleAccessToken } from 'src/types/login';
import { setCookie } from '../utils/cookie';

import { getGoogleAccount } from 'src/api/calendar';
import { getGoogleTokenApi, getKakaoAccessTokenApi } from 'src/api/Login';
import { postAuth } from 'src/api/user';

const useKakaoLogin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { show } = alertAction;
  // 리다이렉트 후 토큰 요청
  const getKakaoToken = (code: string, path: PathName) => {
    getKakaoAccessTokenApi(code)
      .then((getRes) => {
        const accessToken = getRes.data.access_token;
        postAuth(accessToken)
          .then((res) => {
            console.log(res.data.result);
            const {
              userToken: {
                accessToken,
                accessTokenExpiresIn,
                refreshToken,
                refreshTokenExpiresIn,
              },
              ...userInfo
            } = res.data.result;
            localStorage.setItem(
              CURRENT_USER_INFO_KEY,
              JSON.stringify(userInfo)
            );
            setCookie(ACCESS_TOKEN_KEY, accessToken, accessTokenExpiresIn);
            setCookie(REFRESH_TOKEN_KEY, refreshToken, refreshTokenExpiresIn);
            // axios 인스턴스 헤더에 토큰 삽입
            KezulerInstance.defaults.headers.common['Authorization'] =
              accessToken;

            location.replace(`${CURRENT_HOST}${path}`);
          })
          .catch((e) => {
            console.log('소셜로그인 에러', e);
            dispatch(
              show({
                title: '카카오 로그인 오류',
                description: '로그인 과정 중 오류가 생겼습니다.',
              })
            );
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
      });
  };

  return { getKakaoToken };
};

// const useGoogleLoginSuccess = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { show } = alertAction;
//   // 리다이렉트 후 토큰 요청
//   const getGoogleToken = (code: string, redirect_uri: string) => {
//     getGoogleTokenApi(code, redirect_uri)
//       .then((getRes) => {
//         console.log(getRes);
//         const postGoogleToken: PPostGoogleToken = {
//           accessToken: getRes.data.access_token,
//           refreshToken: getRes.data.refresh_token,
//         };
//         postGoogleAccount(postGoogleToken)
//           .then((res) => {
//             console.log(res.data.result);
//           })
//           .catch((e) => {
//             console.log('구글 계정 연동 에러', e);
//             dispatch(
//               show({
//                 title: '구글 계정 오류',
//                 description: '구글 계정 연동중 오류가 생겼습니다.',
//               })
//             );
//           });
//       })
//       .catch((err) => {
//         console.log('구글 계정 연동 에러', err);
//         dispatch(
//           show({
//             title: '구글 계정 오류',
//             description: '구글 계정 연동중 오류가 생겼습니다.',
//           })
//         );
//       });
//   };

//   return { getGoogleToken };
// };

const useGoogleLoginSuccess = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { show } = alertAction;
  // 리다이렉트 후 토큰 요청
  const getGoogleToken = (code: string) => {
    getGoogleAccount(code)
      .then((getRes) => {
        console.log(getRes);
      })
      .catch((err) => {
        console.log('구글 계정 연동 에러', err);
        dispatch(
          show({
            title: '구글 계정 오류',
            description: '구글 계정 연동중 오류가 생겼습니다.',
          })
        );
      });
  };

  return { getGoogleToken };
};

export default useKakaoLogin;
export { useGoogleLoginSuccess };
