import React, { useEffect, useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { ACCESS_TOKEN_KEY, CURRENT_USER_INFO_KEY } from 'src/constants/Auth';
import PathName from 'src/constants/PathName';
import useGetUserInfo from 'src/hooks/useGetUserInfo';
import { getCookie } from 'src/utils/cookie';

import AcceptMeeting from 'src/views/accept-meeting';
import SelectionModifier from 'src/views/accept-meeting/SelectionModifier';
import CreateMeeting from 'src/views/create-meeting';
import KakaoRedirect from 'src/views/KakaoRedirect';
import Login from 'src/views/Login';
import MainPage from 'src/views/MainPage';
import MyPage from 'src/views/MyPage';
import NotiPage from 'src/views/NotiPage';
import TimeConfirmator from 'src/views/pending-event/TimeConfirmator';
import TestPage from 'src/views/TestPage';
// import MainAppBar from 'src/components/common/MainAppBar';

// TODO kakao redirect 가 isLoggedIn true 일 때도 있어야하는데, 순서가 맞게 되어있는지 확인 필요
function RootRoutes() {
  const isLoggedIn = useMemo(() => !!getCookie(ACCESS_TOKEN_KEY), []);

  // TODO 리덕스 필요한지 확인 필요
  const { getUserInfo } = useGetUserInfo();
  useEffect(() => {
    if (isLoggedIn) {
      getUserInfo();
    }
  }, [isLoggedIn]);

  return (
    <>
      {isLoggedIn ? (
        <main>
          <Routes>
            <Route path={PathName.main} element={<MainPage />} />
            <Route path={PathName.notification} element={<NotiPage />} />
            <Route path={PathName.myPage} element={<MyPage />} />
            <Route path={PathName.pending} element={<>login</>} />
            <Route path={PathName.delete} element={<>login</>} />
            <Route path={PathName.create} element={<CreateMeeting />} />
            <Route
              path={`${PathName.modify}/:eventModifyId`}
              element={<SelectionModifier />}
            />
            <Route
              path={`${PathName.confirm}/:eventConfirmId`}
              element={<TimeConfirmator />}
            />
            <Route
              path={`${PathName.invite}/:eventId`}
              element={<AcceptMeeting />}
            />
            <Route path={`/test-page`} element={<TestPage />} />
            <Route path={PathName.kakaoRedirect} element={<KakaoRedirect />} />
            <Route
              path="/*"
              element={<Navigate replace to={PathName.main} />}
            />
          </Routes>
        </main>
      ) : (
        <main>
          <Routes>
            <Route
              path={`${PathName.invite}/:eventId`}
              element={<AcceptMeeting />}
            />
            <Route path={PathName.login} element={<Login />} />
            <Route path={PathName.kakaoRedirect} element={<KakaoRedirect />} />
            <Route path={`/test-page`} element={<TestPage />} />
            <Route
              path="/*"
              element={<Navigate replace to={PathName.login} />}
            />
          </Routes>
        </main>
      )}
      {/* <Route path={PathName.invite} element={<>invite</>}>
        <Route path={':id'} element={<>invite</>} />
      </Route> */}
    </>
  );
}

export default RootRoutes;
