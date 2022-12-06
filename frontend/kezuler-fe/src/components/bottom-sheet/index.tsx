import React from 'react';
import classNames from 'classnames';

import { BFixedEvent } from 'src/types/fixedEvent';
import { PendingEvent } from 'src/types/pendingEvent';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';

import BottomSheetCommentInput from './BottomSheetCommentInput';
import BottomSheetContent from './BottomSheetContent';
import BottomSheetHeader from './BottomSheetHeader';

import 'src/styles/Storage.scss';

interface Props {
  open: boolean;
  comments: {
    _id: string;
    eventID: string;
    userId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  }[];
  event?: PendingEvent | BFixedEvent;
  setData: React.SetStateAction<any>;
  bottomSheetRef: React.MutableRefObject<any>;
}

function BottomSheet({
  open,
  comments,
  event,
  setData,
  bottomSheetRef,
}: Props) {
  const currentUserId = getCurrentUserInfo()?.userId;

  return (
    <div
      ref={bottomSheetRef}
      className={classNames('bottom-sheet', { open: open, close: !open })}
    >
      <BottomSheetHeader />
      <BottomSheetContent
        currentUserId={currentUserId}
        comments={comments}
        event={event}
      />
      <BottomSheetCommentInput
        currentUserId={currentUserId}
        setData={setData}
      />
    </div>
  );
}

export default BottomSheet;
