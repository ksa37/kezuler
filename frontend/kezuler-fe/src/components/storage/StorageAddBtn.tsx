import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Add } from '@mui/icons-material';

import PathName from 'src/constants/PathName';
import useDialog from 'src/hooks/useDialog';

import 'src/styles/components.scss';

function StorageAddBtn() {
  const { openDialog } = useDialog();
  const { eventId } = useParams();
  const navigate = useNavigate();

  const handleAddBoxClick = () => {
    openDialog({
      title: '새로운 자료를 생성하시겠어요?',
      onConfirm: () => navigate(`${PathName.storage}/${eventId}/type`),
    });
  };
  return (
    <div className="storage-add-button" onClick={handleAddBoxClick}>
      <span className="storage-add-button-cross">
        <Add />
      </span>
    </div>
  );
}

export default StorageAddBtn;
