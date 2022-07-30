import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

import PathName, { PathNameList } from 'src/constants/PathName';

function RedirectView() {
  const navigate = useNavigate();

  const checkPath = (currentPath: string) => {
    for (const item in PathNameList) {
      if (typeof item === 'string') {
        if (item === currentPath) {
          return true;
        }
      } else {
        if (currentPath.match(item)) {
          return true;
        }
      }
    }
    return false;
  };

  useEffect(() => {
    const location = useLocation();
    const currentPath = location.pathname;
    const encodedPath = encodeURI(currentPath);

    if (checkPath(currentPath)) {
      navigate(`${PathName.login}/redirect?continue=${encodedPath}`);
    } else {
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
