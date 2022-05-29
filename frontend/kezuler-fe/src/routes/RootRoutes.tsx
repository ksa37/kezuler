import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import PathName from 'src/constants/PathName';

import CreateMeeting from 'src/views/create-meeting/SelectTime';
import Kakao from 'src/views/Kakao';
import Login from 'src/views/Login';
import MainPage from 'src/views/MainPage';
import ButtonAppBar from 'src/components/ButtonAppBar';

function RootRoutes() {
  const isLoggedIn = true;

  return (
    <>
      {isLoggedIn ? (
        <>
          <>
            <ButtonAppBar />
          </>
          <Routes>
            <Route path={PathName.main} element={<MainPage />} />
            <Route path={PathName.notification} element={<>login</>} />
            <Route path={PathName.setting} element={<>login</>} />
            <Route path={PathName.pending} element={<>login</>} />
            <Route path={PathName.delete} element={<>login</>} />
            <Route path={PathName.create} element={<CreateMeeting />} />
            <Route
              path="/*"
              element={<Navigate replace to={PathName.login} />}
            />
          </Routes>
        </>
      ) : (
        // <>
        //   <>
        //     <ButtonAppBar />
        //   </>
        <Routes>
          <Route path={PathName.login} element={<Login />} />
          <Route path={PathName.kakaoRedirect} element={<Kakao />} />
          <Route path="/*" element={<Navigate replace to={PathName.login} />} />
        </Routes>
        // </>
      )}
      {/* <Route path={PathName.invite} element={<>invite</>}>
        <Route path={':id'} element={<>invite</>} />
      </Route> */}
    </>
  );
}

export default RootRoutes;
