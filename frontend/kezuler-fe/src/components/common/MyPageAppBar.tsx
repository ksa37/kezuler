import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';

import PathName from 'src/constants/PathName';

// import CommonAppBar from 'src/components/common/CommonAppBar';
import { ReactComponent as BackIcon } from 'src/assets/left_arrow.svg';

interface Props {
  isEdit: boolean;
  goToMain: () => void;
}

function MyPageAppBar({ isEdit, goToMain }: Props) {
  const navigate = useNavigate();

  const handleGoBackClick = () => {
    if (isEdit) {
      goToMain();
      return;
    }
    navigate(PathName.mainFixed);
  };

  return (
    <header className={'my-page-header'}>
      <div className={'my-page-header-content'}>
        <IconButton
          classes={{ root: 'my-page-header-back-btn' }}
          onClick={handleGoBackClick}
        >
          <BackIcon />
        </IconButton>

        <b>{isEdit ? '프로필 편집' : '마이페이지'}</b>
      </div>
    </header>
  );
}

export default MyPageAppBar;
