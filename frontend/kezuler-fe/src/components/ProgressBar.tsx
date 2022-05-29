import React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

import 'src/styles/constants.scss';

interface Props {
  progress: number;
}
function ProgressBar({ progress }: Props) {
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          backgroundColor: '#ffff',
          '& .MuiLinearProgress-barColorPrimary': {
            backgroundColor: '#fad94f',
          },
        }}
      />
    </Box>
  );
}

export default ProgressBar;
