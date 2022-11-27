import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import PathName from 'src/constants/PathName';
import { createStorageActions } from 'src/reducers/CreateStorage';
import { AppDispatch } from 'src/store';

import 'src/styles/Storage.scss';

function StorageTypeSelect() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { setType, destroy } = createStorageActions;
  const { eventId } = useParams();

  // [title, type]
  const TypeList = [
    // ['사진', 'photo'],
    ['메모', 'memo'],
    ['링크', 'link'],
    // ['파일', 'file'],
  ];

  const handleBoxClick = (type: string) => {
    dispatch(setType(type));
    navigate(`${PathName.storage}/${eventId}/${type}`);
  };

  return (
    <div className="storage-wrapper">
      <h2 className="storage-type-title">어떤 자료를 추가하시겠어요?</h2>
      {TypeList.map((el, idx) => (
        <div
          key={idx}
          className="storage-type-select-box"
          onClick={() => handleBoxClick(el[1])}
        >
          {el[0]}
        </div>
      ))}
    </div>
  );
}

export default StorageTypeSelect;
