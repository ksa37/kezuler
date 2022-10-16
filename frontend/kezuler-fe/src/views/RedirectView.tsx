import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

import PathName, { PathNameList } from 'src/constants/PathName';

function RedirectView() {
  const navigate = useNavigate();
  const location = useLocation();
  const checkPath = (currentPath: string) => {
    for (const item in PathNameList) {
      const checkPath = PathNameList[item];
      if (typeof checkPath === 'string') {
        if (checkPath === currentPath) {
          return true;
        }
      } else {
        if (currentPath.match(checkPath)) {
          return true;
        }
      }
    }
    return false;
  };

  useEffect(() => {
    const currentPath = location.pathname;
    const encodedPath = encodeURI(currentPath);

    if (checkPath(currentPath)) {
      navigate(`${PathName.login}/redirect?continue=${encodedPath}`);
    } else if (currentPath === PathName.login) {
      navigate(PathName.login);
    } else {
      console.log(location.pathname);
      navigate(`${PathName.notFound}`);
    }
  }, []);

  return (
    <div>
      <CircularProgress />
    </div>
  );
}

export default RedirectView;
