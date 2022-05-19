import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import PathName from '../constants/PathName';

import CreateMeeting from '../views/create-meeting/SelectTime';
import Kakao from '../views/Kakao';
import Login from '../views/Login';
import ButtonAppBar from '../components/ButtonAppBar';

function RootRoutes() {
  const isLoggedIn = false;

  return (
    <>
      {isLoggedIn ? (
        <>
          <>
            <ButtonAppBar />
          </>
          <Routes>
            <Route path={PathName.main} element={<>login</>} />
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
