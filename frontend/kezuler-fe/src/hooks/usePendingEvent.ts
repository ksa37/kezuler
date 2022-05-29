import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import PathName from 'src/constants/PathName';
import { RootState } from 'src/reducers';
import { acceptMeetingActions } from 'src/reducers/AcceptMeeting';
import { createMeetingActions } from 'src/reducers/CreateMeeting';
import { AppDispatch } from 'src/store';
import { PendingEvent } from 'src/types/pendingEvent';

import { getPendingEventsById, postPendingEvent } from 'src/api/pendingEvent';

const useGetPendingEvent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { setPendingEvent } = acceptMeetingActions;
  // const { pendingEvent } = useSelector(
  //   (state: RootState) => state.acceptMeeting
  // );
  const getPendingEventInfo = (eventId: string) => {
    getPendingEventsById(eventId)
      .then((res) => {
        dispatch(setPendingEvent(res.data));
        // return res.data;
      })
      .catch((err) => {
        console.log('미팅 수락 에러', err);
        window.alert('미팅 정보를 받아올 수 없습니다');
        navigate(PathName.invite + `/${eventId}`, { replace: true });
        // return pendingEvent;
      });
  };

  return getPendingEventInfo;
};

const usePostPendingEvent = () => {
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

  return getShareUrl;
};

export { useGetPendingEvent, usePostPendingEvent };
