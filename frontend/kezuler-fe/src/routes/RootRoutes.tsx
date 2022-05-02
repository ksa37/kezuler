import { Navigate, Route, Routes } from 'react-router-dom';
import PathName from '../constants/PathName';

import React from 'react';

function RootRoutes() {
  const isLoggedIn = false;

  return (
    <Routes>
      {isLoggedIn ? (
        <>
          <Route path={PathName.main} element={<>login</>}></Route>
          <Route path={PathName.notification} element={<>login</>}></Route>
          <Route path={PathName.setting} element={<>login</>}></Route>
          <Route path={PathName.pending} element={<>login</>}></Route>
          <Route path={PathName.delete} element={<>login</>}></Route>
          <Route path={PathName.create} element={<>login</>}></Route>
          <Route path="/*" element={<Navigate replace to={PathName.login} />} />
        </>
      ) : (
        <>
          <Route path={PathName.login} element={<>login</>}></Route>
          <Route path="/*" element={<Navigate replace to={PathName.login} />} />
        </>
      )}
      <Route path={PathName.invite} element={<>invite</>}>
        <Route path={':id'} element={<>invite</>} />
      </Route>
    </Routes>
  );
}

export default RootRoutes;
