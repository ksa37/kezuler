import { useNavigate } from 'react-router-dom';

import PathName from '../constants/PathName';

import { getKakaoTokenApi, postAccessTokenApi } from '../api/Login';

const useKakaoLogin = () => {
  const navigate = useNavigate();

  // 리다이렉트 후 토큰 요청
  const getKakaoToken = (code: string) => {
    getKakaoTokenApi(code)
      .then((res) => {
        const accessToken = res.data.accessToken;
        postAccessTokenApi(accessToken)
          .then((res2) => {
            // TODO 서버에 보내고 kezuler token, profile 받아와서 저장
            const kezulerToken = res2.data.token;
            localStorage.setItem('token', kezulerToken);
            navigate(PathName.main, { replace: true });
          })
          .catch((e) => {
            console.log('소셜로그인 에러', e);
            window.alert('로그인에 실패하였습니다.');
            navigate(PathName.login, { replace: true });
          });
      })
      .catch((err) => {
        console.log('소셜로그인 에러', err);
        window.alert('로그인에 실패하였습니다.');
        navigate(PathName.login, { replace: true });
      });
  };

  return { getKakaoToken };
};

export default useKakaoLogin;
