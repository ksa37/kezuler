import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import PathName from 'src/constants/PathName';
import { createStorageActions } from 'src/reducers/CreateStorage';
import { AppDispatch } from 'src/store';
import { StorageType } from '../../types/Storage';

import 'src/styles/Storage.scss';

function StorageTypeSelect() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { setType, destroy } = createStorageActions;
  const { eventId } = useParams();

  // Record<StorageType, string>
  const TypeList: { link: string; memo: string } = {
    memo: '메모',
    link: '링크',
    // photo: '사진',
    // file: '파일',
  };

  const handleBoxClick = (type: StorageType) => {
    dispatch(setType(type));
    navigate(`${PathName.storage}/${eventId}/${type}`);
  };

  return (
    <div className="storage-wrapper">
      <h2 className="storage-type-title">어떤 자료를 추가하시겠어요?</h2>
      {Object.entries(TypeList).map(([type, value]) => (
        <div
          key={type}
          className="storage-type-select-box"
          onClick={() => handleBoxClick(type as StorageType)}
        >
          {value}
        </div>
      ))}
    </div>
  );
}

export default StorageTypeSelect;
