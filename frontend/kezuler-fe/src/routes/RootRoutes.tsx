import React, { useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { ACCESS_TOKEN_KEY } from 'src/constants/Auth';
import PathName from 'src/constants/PathName';
import { getCookie } from 'src/utils/cookie';

import TestPage from '../views/TestPage';
import AcceptMeeting from 'src/views/accept-meeting';
import CreateMeeting from 'src/views/create-meeting';
import KakaoRedirect from 'src/views/KakaoRedirect';
import Login from 'src/views/Login';
import MainPage from 'src/views/MainPage';
import ButtonAppBar from 'src/components/ButtonAppBar';

function RootRoutes() {
  const isLoggedIn = useMemo(() => !!getCookie(ACCESS_TOKEN_KEY), []);

  return (
    <>
      {isLoggedIn ? (
        <main>
          <Routes>
            <Route
              path={PathName.main}
              element={
                <>
                  <ButtonAppBar />
                  <MainPage />
                </>
              }
            />
            <Route path={PathName.notification} element={<>login</>} />
            <Route path={PathName.setting} element={<>login</>} />
            <Route path={PathName.pending} element={<>login</>} />
            <Route path={PathName.delete} element={<>login</>} />
            <Route path={PathName.create} element={<CreateMeeting />} />
            <Route
              path={`${PathName.invite}/:eventId`}
              element={<AcceptMeeting />}
            />
            <Route path={`/test-page`} element={<TestPage />} />
            <Route
              path="/*"
              element={<Navigate replace to={PathName.main} />}
            />
          </Routes>
        </main>
      ) : (
        // <main>
        <Routes>
          <Route
            path={PathName.invite + '/:eventId'}
            element={<AcceptMeeting />}
          />
          <Route path={PathName.login} element={<Login />} />
          <Route path={PathName.kakaoRedirect} element={<KakaoRedirect />} />
          <Route path={`/test-page`} element={<TestPage />} />
          <Route path="/*" element={<Navigate replace to={PathName.login} />} />
        </Routes>
        // </main>
      )}
      {/* <Route path={PathName.invite} element={<>invite</>}>
        <Route path={':id'} element={<>invite</>} />
      </Route> */}
    </>
  );
}

export default RootRoutes;
