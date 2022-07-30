import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';

import { ReactComponent as CloseIcon } from 'src/assets/icn_close_b.svg';

interface Props {
  title: string;
}

function PolicyAppBar({ title }: Props) {
  const navigate = useNavigate();

  const handleCloseClick = () => {
    navigate(-1);
  };

  return (
    <header className={'policy-header'}>
      <div className={'policy-header-content'}>
        <b>{title}</b>
        <IconButton
          classes={{ root: 'policy-header-back-btn' }}
          onClick={handleCloseClick}
        >
          <CloseIcon />
        </IconButton>
      </div>
    </header>
  );
}

export default PolicyAppBar;
