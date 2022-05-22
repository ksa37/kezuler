import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import PathName from '../constants/PathName';
import { createMeetingActions } from '../reducers/CreateMeeting';
import { AppDispatch } from '../store/store';
import { PendingEvent } from '../types/pendingEvent';

import { postPendingEvent } from '../api/pendingEvent';

const usePostPendingMeeting = (pendingEvent: PendingEvent) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { setShareUrl } = createMeetingActions;
  // 리다이렉트 후 토큰 요청
  const getShareUrl = (pendingEvent: PendingEvent) => {
    postPendingEvent(pendingEvent)
      .then((res) => {
        // TODO shar URL 처리하기
        // const shareUrl = res.data.shareUrl;
        // dispatch(setShareUrl(shareUrl));
        navigate(PathName.share, { replace: true });

        // const accessToken = res.data.accessToken;
        // postAccessTokenApi(accessToken)
        //   .then((res2) => {
        //     // TODO 서버에 보내고 kezuler token, profile 받아와서 저장
        //     const kezulerToken = res2.data.token;
        //     localStorage.setItem('token', kezulerToken);
        //     navigate(PathName.main, { replace: true });
        //   })
        //   .catch((e) => {
        //     console.log('소셜로그인 에러', e);
        //     window.alert('로그인에 실패하였습니다.');
        //     navigate(PathName.login, { replace: true });
        //   });
      })
      .catch((err) => {
        console.log('미팅 생성 에러', err);
        window.alert('미팅 생성 과정 중 오류가 생겼습니다');
        navigate(PathName.create, { replace: true });
      });
  };

  return { getShareUrl };
};

export default usePostPendingMeeting;
