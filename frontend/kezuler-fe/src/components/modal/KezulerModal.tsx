import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog } from '@mui/material';

import { MODAL_COMPONENTS } from 'src/constants/Modal';
import { RootState } from 'src/reducers';
import { modalAction } from 'src/reducers/modal';

function KezulerModal() {
  const { hide } = modalAction;
  const dispatch = useDispatch();

  const closeModal = useCallback(() => {
    dispatch(hide());
  }, [dispatch, hide]);

  const { modalInfo } = useSelector((state: RootState) => state.modal);

  // 아무 조작하지 않고 닫았을 때 (모달 밖 클릭, X 버튼 클릭 등)
  const handleClose = () => {
    closeModal();
  };

  if (!modalInfo) {
    return null;
  }
  const { type, props } = modalInfo;
  const ModalBody = MODAL_COMPONENTS[type];

  return (
    <Dialog
      open={!!type}
      onClose={handleClose}
      classes={{ paper: 'modal-paper' }}
    >
      <ModalBody {...props} />
    </Dialog>
  );
}

export default KezulerModal;
