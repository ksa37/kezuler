import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PathName from 'src/constants/PathName';
import useDialog from 'src/hooks/useDialog';

import WarningImg from 'src/assets/image/warning.png';
import 'src/styles/components.scss';

interface StorageLinkBox {
  id: string;
  storageTitle: string;
  storageType: string;
  storageMetaImageUrl: string;
}

function StorageLinkBox({
  id,
  storageTitle,
  storageType,
  storageMetaImageUrl,
}: StorageLinkBox) {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const handleImgError = (e: any) => {
    e.target.src = WarningImg;
  };

  return (
    <div
      className="storage-box"
      onClick={() => navigate(`${PathName.storage}/${eventId}/link/${id}`)}
    >
      <div className="storage-box-title">{storageTitle}</div>
      <div className="storage-box-wrapper">
        <img
          onError={handleImgError}
          src={storageMetaImageUrl !== '' ? storageMetaImageUrl : WarningImg}
          className="storage-box-image"
        />
      </div>
    </div>
  );
}

export default StorageLinkBox;
