import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import KezulerStorageInstance from 'src/constants/api-storage';
import PathName from 'src/constants/PathName';
import useDialog from 'src/hooks/useDialog';
import { RootState } from 'src/reducers';
import { createStorageActions } from 'src/reducers/CreateStorage';
import { AppDispatch } from 'src/store';

import BottomButton from 'src/components/common/BottomButton';

import 'src/styles/Storage.scss';

function StorageMemoWrite() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { openDialog } = useDialog();
  const location = useLocation();

  const { eventId } = useParams();
  const { id } = useParams();

  const { setMemoContent } = createStorageActions;

  const { storageType, storageMemoContent } = useSelector(
    (state: RootState) => state.createStorage
  );

  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (location.pathname.split('/').slice(-1)[0] === 'edit') {
      setIsEdit(true);
      KezulerStorageInstance.get(`/memo/${id}`).then((res) => {
        dispatch(setMemoContent(res.data.memo.content));
      });
    } else setIsEdit(false);
  }, []);

  const handleNextClick = () => {
    if (!isEdit)
      navigate(`${PathName.storage}/${eventId}/${storageType}/title`);
    if (isEdit)
      openDialog({
        title: '수정하시겠습니까?',
        onConfirm: () => {
          KezulerStorageInstance.patch(`/memo/${id}`, {
            content: storageMemoContent,
          }).then(() => {
            navigate(`${PathName.storage}/${eventId}`);
          });
        },
      });
  };

  return (
    <div className="storage-wrapper">
      <h2>{`${isEdit ? '수정' : '업로드'}할 텍스트를 입력해주세요`}</h2>
      <textarea
        className={'storage-type-textarea'}
        placeholder="텍스트를 입력해주세요."
        onChange={(e) => dispatch(setMemoContent(e.target.value))}
        value={storageMemoContent}
      />
      <BottomButton
        disabled={storageMemoContent === ''}
        onClick={handleNextClick}
        text={isEdit ? '확인' : '다음'}
      />
    </div>
  );
}

export default StorageMemoWrite;
