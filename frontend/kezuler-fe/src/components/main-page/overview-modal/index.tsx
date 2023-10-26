import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import PathName from 'src/constants/PathName';

import Overview from './Overview';
import KezulerPaper from 'src/components/common/KezulerPaper';

import 'src/styles/OverviewModal.scss';

function OverviewModal() {
  const location = useLocation();
  const navigate = useNavigate();

  const isFixedMeeting = location.pathname.startsWith(PathName.mainFixed);

  // 아무 조작하지 않고 닫았을 때 (모달 밖 클릭, X 버튼 클릭 등)
  const handleClose = () => {
    navigate(isFixedMeeting ? PathName.mainFixed : PathName.mainPending);
  };

  return (
    <KezulerPaper open onClose={handleClose}>
      <div className={'overview-modal'}>
        <Overview />
      </div>
    </KezulerPaper>
  );
}

export default OverviewModal;
