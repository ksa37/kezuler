import React from 'react';
import Portal from '@mui/material/Portal';

interface Props {
  open: boolean;
  children: React.ReactElement;
  onClose: (event: React.TouchEvent | React.MouseEvent) => void;
}

// Wrapper for dialog, alert, modal
function KezulerPaper({ open, children, onClose }: Props) {
  // kezuler-dialog-wrapper 만 눌렀을 때 onClose 실행
  const handleClickAway = (e: React.TouchEvent | React.MouseEvent) => {
    if (e.currentTarget === e.target) {
      onClose(e);
    }
  };

  return open ? (
    <Portal container={document.getElementById('App') || document.body}>
      <div onMouseDown={handleClickAway} className={'kezuler-dialog-wrapper'}>
        {children}
      </div>
    </Portal>
  ) : null;
}

export default KezulerPaper;
