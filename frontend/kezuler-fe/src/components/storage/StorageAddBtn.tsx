import React from 'react';
import { useParams } from 'react-router-dom';

import KezulerStorageInstance from 'src/constants/api-storage';
import useDialog from 'src/hooks/useDialog';

import 'src/styles/components.scss';

function StorageAddBtn() {
  const { openDialog } = useDialog();
  const { eventConfirmId } = useParams();
  console.log(eventConfirmId);
  const handleAddFolderClick = () => {
    const postFolder = () =>
      KezulerStorageInstance.post(`folder/${eventConfirmId}`, {
        type: 'note2',
        title: '필독사항',
        content: '살아가는데 많은 힘이 될것입니다.',
        eventId: eventConfirmId,
      });

    openDialog({
      title: '보관함을 생성하시겠어요?',
      onConfirm: () => postFolder(),
    });
  };
  return (
    <div className="storage-add-button" onClick={handleAddFolderClick}>
      <span className="storage-add-button-cross">+</span>
    </div>
  );
}

export default StorageAddBtn;
