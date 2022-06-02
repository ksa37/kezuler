import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import PathName from 'src/constants/PathName';

import AcceptMeeting from 'src/views/accept-meeting';
import CreateMeeting from 'src/views/create-meeting';
import MeetingShare from 'src/views/create-meeting/MeetingShare';
import Kakao from 'src/views/Kakao';
import Login from 'src/views/Login';
import MainPage from 'src/views/MainPage';
import ButtonAppBar from 'src/components/ButtonAppBar';

function RootRoutes() {
  const isLoggedIn = true;

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
              path={PathName.invite + '/:eventId'}
              element={<AcceptMeeting />}
            />
            <Route
              path="/*"
              element={<Navigate replace to={PathName.login} />}
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
          <Route path={PathName.kakaoRedirect} element={<Kakao />} />
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
