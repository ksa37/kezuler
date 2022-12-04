import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';
import classNames from 'classnames';

import PathName from 'src/constants/PathName';

import KezulerPaper from 'src/components/common/KezulerPaper';

import { ReactComponent as CloseIcon } from 'src/assets/icn_close_b.svg';
import Tutorial1 from 'src/assets/image/tutorial1.png';
import Tutorial2 from 'src/assets/image/tutorial2.png';
import Tutorial3 from 'src/assets/image/tutorial3.png';
import Tutorial4 from 'src/assets/image/tutorial4.png';
import Tutorial5 from 'src/assets/image/tutorial5.png';
import Tutorial6 from 'src/assets/image/tutorial6.png';
import { ReactComponent as ArrowLeftIcon } from 'src/assets/left_arrow.svg';
import 'src/styles/OverviewModal.scss';

function Tutorials() {
  const location = useLocation();
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);

  const isFixedMeeting = location.pathname.startsWith(PathName.mainFixed);

  // 아무 조작하지 않고 닫았을 때 (모달 밖 클릭, X 버튼 클릭 등)
  const handleClose = () => {
    navigate(isFixedMeeting ? PathName.mainFixed : PathName.mainPending);
  };
  const handleChangeIndex = (index: number) => {
    setIndex(index);
  };
  const handleLeftClick = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };
  const handleRightClick = () => {
    if (index < 5) {
      setIndex(index + 1);
    }
  };
  return (
    <KezulerPaper open onClose={handleClose}>
      <div className={'overview'}>
        <button className={'overview-close-btn'} onClick={handleClose}>
          닫기
          <CloseIcon />
        </button>
        <div className={'overview-container'}>
          {index > 0 && (
            <ArrowLeftIcon
              className={classNames('tutorial-arrow', 'left')}
              onClick={handleLeftClick}
            />
          )}
          {index < 5 && (
            <ArrowLeftIcon
              className={classNames('tutorial-arrow', 'right')}
              onClick={handleRightClick}
            />
          )}
          <SwipeableViews
            index={index}
            onChangeIndex={handleChangeIndex}
            enableMouseEvents
          >
            <img src={Tutorial1} style={{ width: '100%' }} />
            <img src={Tutorial2} style={{ width: '100%' }} />
            <img src={Tutorial3} style={{ width: '100%' }} />
            <img src={Tutorial4} style={{ width: '100%' }} />
            <img src={Tutorial5} style={{ width: '100%' }} />
            <img src={Tutorial6} style={{ width: '100%' }} />
          </SwipeableViews>
        </div>
      </div>
    </KezulerPaper>
  );
}

export default Tutorials;
