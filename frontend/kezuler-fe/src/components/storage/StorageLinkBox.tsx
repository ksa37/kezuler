import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PathName from 'src/constants/PathName';
import { StorageType } from 'src/types/Storage';

import NoImg from 'src/assets/image/no_image.jpeg';
import 'src/styles/components.scss';

interface Props {
  id: string;
  storageTitle: string;
  storageType: StorageType;
  storageMetaImageUrl: string;
}

function StorageLinkBox({ id, storageTitle, storageMetaImageUrl }: Props) {
  const navigate = useNavigate();
  const { eventId } = useParams();

  const handleImgError = (e: any) => {
    e.target.src = NoImg;
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
          src={storageMetaImageUrl !== '' ? storageMetaImageUrl : NoImg}
          className="storage-box-image"
        />
      </div>
    </div>
  );
}

export default StorageLinkBox;
