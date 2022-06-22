import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';

import CommonAppBar from 'src/components/common/CommonAppBar';

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
    navigate(-1);
  };

  return (
    <CommonAppBar>
      <div className={'my-page-header'}>
        <IconButton
          className={'my-page-header-back-btn'}
          onClick={handleGoBackClick}
        >
          <BackIcon />
        </IconButton>
        {isEdit ? '프로필 편집' : '마이페이지'}
      </div>
    </CommonAppBar>
  );
}

export default MyPageAppBar;
