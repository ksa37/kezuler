import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import classNames from 'classnames';

import { RootState } from 'src/reducers';
import { alertAction } from 'src/reducers/alert';

import { ReactComponent as CloseIcon } from 'src/assets/icn_close_b.svg';

function KezulerAlert() {
  const { hide } = alertAction;
  const dispatch = useDispatch();

  const closeModal = useCallback(() => {
    dispatch(hide());
  }, [dispatch, hide]);

  const { alertProps } = useSelector((state: RootState) => state.alert);

  if (!alertProps) {
    return null;
  }

  const { title, description } = alertProps;

  // 아무 조작하지 않고 닫았을 때 (모달 밖 클릭, X 버튼 클릭 등)
  const handleClose = () => {
    closeModal();
  };

  return (
    <Dialog
      open={!!alertProps}
      onClose={handleClose}
      classes={{ paper: 'kezuler-dialog' }}
    >
      <button className={'kezuler-alert-close-btn'} onClick={closeModal}>
        <CloseIcon />
      </button>
      <div className={classNames('kezuler-dialog-body', 'alert')}>
        <h1>{title}</h1>
        {description && <h2>{description}</h2>}
      </div>
    </Dialog>
  );
}

export default KezulerAlert;
