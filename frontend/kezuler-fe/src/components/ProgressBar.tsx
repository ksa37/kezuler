import React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

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
            backgroundColor: '#ffff',
          },
        }}
      />
    </Box>
  );
}

export default ProgressBar;
