import { Navigate, Route, Routes } from 'react-router-dom';
import PathName from '../constants/PathName';

import React from 'react';
import Login from '../views/Login';
import Kakao from '../views/Kakao';
import ButtonAppBar from '../components/ButtonAppBar';
import CalendarView from '../views/CalendarView';

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
            <Route path={PathName.main} element={<>login</>}></Route>
            <Route path={PathName.notification} element={<>login</>}></Route>
            <Route path={PathName.setting} element={<>login</>}></Route>
            <Route path={PathName.pending} element={<>login</>}></Route>
            <Route path={PathName.delete} element={<>login</>}></Route>
            <Route path={PathName.create} element={<>login</>}></Route>
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
          <Route path={PathName.login} element={<Login />}></Route>
          <Route path={PathName.kakaoRedirect} element={<Kakao />}></Route>
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
