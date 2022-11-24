import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames';

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

  return (
    <div className="storage-wrapper">
      <h2>업로드할 링크를 입력해주세요</h2>
      <textarea
        className={classNames('storage-type-textarea', {
          'is-link': true,
        })}
        placeholder="링크를 입력해주세요."
        onChange={(e) => dispatch(setLinkContent(e.target.value))}
        value={storageLinkContent}
      />
      <BottomButton onClick={handleNextClick} text="다음" />
    </div>
  );
}

export default StorageLinkWrite;
