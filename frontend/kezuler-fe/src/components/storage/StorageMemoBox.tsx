import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PathName from 'src/constants/PathName';
import useDialog from 'src/hooks/useDialog';

import 'src/styles/components.scss';

interface StorageMemoBox {
  id: string;
  storageTitle: string;
  storageMemoContent: string;
}

function StorageMemoBox({
  id,
  storageTitle,
  storageMemoContent,
}: StorageMemoBox) {
  const navigate = useNavigate();
  const { eventId } = useParams();

  return (
    <div
      className="storage-box"
      onClick={() => navigate(`${PathName.storage}/${eventId}/memo/${id}`)}
    >
      <div className="storage-box-title">{storageTitle}</div>
      <div className="storage-box-content">{storageMemoContent}</div>
    </div>
  );
}

export default StorageMemoBox;
