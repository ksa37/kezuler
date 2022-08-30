import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { RootState } from 'src/reducers';
import { notiAction } from 'src/reducers/noti';

import KezulerPaper from 'src/components/common/KezulerPaper';

import 'src/styles/dialog.scss';

function KezulerNoti() {
  const { hide } = notiAction;
  const dispatch = useDispatch();

  const closeModal = useCallback(() => {
    dispatch(hide());
  }, [dispatch, hide]);

  const { notiProps } = useSelector((state: RootState) => state.noti);

  if (!notiProps) {
    return null;
  }

  const { title, onCancel, onConfirm } = notiProps;

  // 아무 조작하지 않고 닫았을 때 (모달 밖 클릭, X 버튼 클릭 등)
  const handleClose = () => {
    onConfirm?.();
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
    <KezulerPaper open={!!notiProps} onClose={handleClose}>
      <div className={'kezuler-dialog'}>
        <div className={'kezuler-dialog-body'}>
          <div className={'noti-title'}>{title}</div>
          <div className={classNames('kezuler-dialog-date-wrapper', 'noti')}>
            <span className={'noti-desc'}>{'미팅 시간을 '} </span>
            <span className={classNames('noti-desc', 'highlight')}>
              <b>{'최대 5개'}</b>
            </span>
            <span className={'noti-desc'}>{'까지 선택하여'}</span>
            <br />
            <span className={'noti-desc'}>
              {'참여자들에게 물어볼 수 있으며,'}
            </span>
            <br />
            <span className={'noti-desc'}>
              {'투표 결과에 따라 미팅 시간을 확정 지을 수 있습니다.'}
            </span>
          </div>
        </div>
        <div className={'noti-btns'}>
          <div className={'noti-reject'} onClick={handleCancelClick}>
            다시 보지 않기
          </div>
          <div className={'noti-confirm'} onClick={handleConfirmClick}>
            확인
          </div>
        </div>
      </div>
    </KezulerPaper>
  );
}

export default KezulerNoti;
