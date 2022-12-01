import React, { KeyboardEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import PathName from 'src/constants/PathName';
import { RootState } from 'src/reducers';
import { createStorageActions } from 'src/reducers/CreateStorage';
import { AppDispatch } from 'src/store';

import BottomButton from 'src/components/common/BottomButton';

import 'src/styles/Storage.scss';

function StorageLinkWrite() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { eventId } = useParams();
  const { setLinkContent } = createStorageActions;

  const { storageType, storageLinkContent } = useSelector(
    (state: RootState) => state.createStorage
  );

  const handleNextClick = () => {
    navigate(`${PathName.storage}/${eventId}/${storageType}/title`);
  };

  const handleEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key.toLowerCase() === 'enter') {
      handleNextClick();
    }
  };
  return (
    <div className="storage-wrapper">
      <h2>업로드할 링크를 입력해주세요</h2>
      <input
        className="storage-title-input"
        placeholder="링크를 입력해주세요."
        onChange={(e) => dispatch(setLinkContent(e.target.value))}
        value={storageLinkContent}
        onKeyPress={handleEnter}
      />
      <BottomButton
        disabled={storageLinkContent === ''}
        onClick={handleNextClick}
        text="다음"
      />
    </div>
  );
}

export default StorageLinkWrite;
