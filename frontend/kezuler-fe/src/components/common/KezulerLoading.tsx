import React from 'react';
import { useSelector } from 'react-redux';
import { CircularProgress, Dialog } from '@mui/material';

import { RootState } from 'src/reducers';

import 'src/styles/loading.scss';

function KezulerLoading() {
  const { loading } = useSelector((state: RootState) => state.loading);

  return (
    <Dialog
      BackdropProps={{ style: { backgroundColor: 'rgba(0,0,0,0.3)' } }}
      classes={{ paper: 'kezuler-loading-paper', root: 'kezuler-loading' }}
      open={loading}
    >
      <CircularProgress
        size={50}
        classes={{ root: 'kezuler-loading-progress' }}
        disableShrink
      />
    </Dialog>
  );
}

export default KezulerLoading;
