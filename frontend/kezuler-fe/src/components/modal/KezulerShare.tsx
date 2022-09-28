import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { RootState } from 'src/reducers';
import { shareAction } from 'src/reducers/share';

import KezulerPaper from 'src/components/common/KezulerPaper';

import { ReactComponent as CloseIcon } from 'src/assets/icn_close_b.svg';

function KezulerShare() {
  const { hide } = shareAction;
  const dispatch = useDispatch();

  const closeModal = useCallback(() => {
    dispatch(hide());
  }, [dispatch, hide]);

  const { shareProps } = useSelector((state: RootState) => state.share);

  if (!shareProps) {
    return null;
  }

  const { title, element } = shareProps;

  // 아무 조작하지 않고 닫았을 때 (모달 밖 클릭, X 버튼 클릭 등)
  const handleClose = () => {
    closeModal();
  };

  return (
    <KezulerPaper open={!!shareProps} onClose={handleClose}>
      <div className={classNames('kezuler-share', 'kezuler-dialog')}>
        <button className={'kezuler-alert-close-btn'} onClick={closeModal}>
          <CloseIcon />
        </button>
        <div
          className={classNames(
            'kezuler-dialog-body',
            'alert',
            'share-for-popup'
          )}
        >
          <h1>{title}</h1>
          {element}
        </div>
      </div>
    </KezulerPaper>
  );
}

export default KezulerShare;
