import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

import PathName from 'src/constants/PathName';

function AcceptIndex() {
  const navigate = useNavigate();
  const { eventId } = useParams();

  useEffect(() => {
    navigate(`${PathName.invite}/${eventId}/invitation`);
  }, []);

  return (
    <div>
      <CircularProgress />
    </div>
  );
}

export default AcceptIndex;
