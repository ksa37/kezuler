import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';

import 'src/styles/constants.scss';

interface Props {
  progress: number;
  yellowBar?: boolean;
}
function ProgressBar({ progress, yellowBar = false }: Props) {
  const barColor = yellowBar ? '#fad94f' : '#282f39';
  return (
    <LinearProgress
      variant="determinate"
      value={progress}
      sx={{
        width: '100%',
        position: 'fixed',
        top: '68px',
        zIndex: '2',
        backgroundColor: '#ffff',
        '& .MuiLinearProgress-barColorPrimary': {
          backgroundColor: `${barColor}`,
        },
      }}
    />
  );
}

export default ProgressBar;
