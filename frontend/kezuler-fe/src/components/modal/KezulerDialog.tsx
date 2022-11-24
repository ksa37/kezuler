import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'src/reducers';
import { dialogAction } from 'src/reducers/dialog';

import KezulerPaper from 'src/components/common/KezulerPaper';

function KezulerDialog() {
  const { hide } = dialogAction;
  const dispatch = useDispatch();

  const closeModal = useCallback(() => {
    dispatch(hide());
  }, [dispatch, hide]);

  const { dialogProps } = useSelector((state: RootState) => state.dialog);

  if (!dialogProps) {
    return null;
  }

  const { date, timeRange, title, description, onCancel, onConfirm } =
    dialogProps;

  // 아무 조작하지 않고 닫았을 때 (모달 밖 클릭, X 버튼 클릭 등)
  const handleClose = () => {
    closeModal();
  };

  const handleCancelClick = () => {
    onCancel?.();
    closeModal();
  };

  const handleConfirmClick = () => {
    onConfirm?.();
    closeModal();
  };

  return (
    <KezulerPaper open={!!dialogProps} onClose={handleClose}>
      <div className={'kezuler-dialog'}>
        <div className={'kezuler-dialog-body'}>
          <div className={'kezuler-dialog-date-wrapper'}>
            {date && <h1 className={'date'}>{date}</h1>}
            {timeRange && <br />}
            {timeRange && <h1 className={'date'}>{`${timeRange}`}</h1>}
          </div>
          <h1>{title}</h1>
          {description && <h2>{description}</h2>}
        </div>
        {onConfirm && (
          <footer className={'kezuler-dialog-footer'}>
            <button onClick={handleCancelClick}>아니오</button>
            <button className={'confirm'} onClick={handleConfirmClick}>
              예
            </button>
          </footer>
        )}
      </div>
    </KezulerPaper>
  );
}

export default KezulerDialog;
