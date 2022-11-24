import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import KezulerStorageInstance from 'src/constants/api-storage';
import PathName from 'src/constants/PathName';
import useDialog from 'src/hooks/useDialog';
import { RootState } from 'src/reducers';
import { createStorageActions } from 'src/reducers/CreateStorage';
import { AppDispatch } from 'src/store';

import BottomButton from 'src/components/common/BottomButton';

import 'src/styles/Storage.scss';

function StorageTitle() {
  const dispatch = useDispatch<AppDispatch>();
  const { openDialog } = useDialog();
  const { setTitle, destroy } = createStorageActions;
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [titleWord, setTitleWord] = useState('');
  const { storageType, storageTitle, storageMemoContent, storageLinkContent } =
    useSelector((state: RootState) => state.createStorage);

  useEffect(() => {
    if (storageType === 'photo') setTitleWord('사진을');
    if (storageType === 'memo') setTitleWord('메모를');
    if (storageType === 'link') setTitleWord('링크를');
    if (storageType === 'file') setTitleWord('파일을');
  }, []);

  const handleClickConfirm = () => {
    openDialog({
      title: `새로운 ${titleWord} 생성하시겠어요?`,
      onConfirm: () => {
        if (storageType === 'memo') {
          KezulerStorageInstance.post(`/memo`, {
            eventId,
            title: storageTitle,
            content: storageMemoContent,
          }).then(() => {
            dispatch(destroy());
            navigate(`${PathName.storage}/${eventId}`);
          });
        }
        if (storageType === 'link') {
          KezulerStorageInstance.post(`/link`, {
            eventId,
            title: storageTitle,
            url: storageLinkContent,
          }).then(() => {
            dispatch(destroy());
            navigate(`${PathName.storage}/${eventId}`);
          });
        }
      },
    });
  };

  return (
    <div className="storage-wrapper">
      <h2>자료의 이름을 정해주세요!</h2>
      <input
        className="storage-title-input"
        placeholder="텍스트를 입력해주세요."
        onChange={(e) => dispatch(setTitle(e.target.value))}
        value={storageTitle}
      />
      <BottomButton onClick={handleClickConfirm} text="확인" />
    </div>
  );
}

export default StorageTitle;
