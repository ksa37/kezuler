import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

import KezulerStorageInstance from 'src/constants/api-storage';
import { createCommentActions } from 'src/reducers/CreateComment';
import { createStorageActions } from 'src/reducers/CreateStorage';
import { AppDispatch } from 'src/store';
import { BFixedEvent, RGetFixedEvent } from 'src/types/fixedEvent';
import { PendingEvent, RPendingEvent } from 'src/types/pendingEvent';
import { StorageChildProps } from 'src/types/Storage';

import BottomSheet from 'src/components/bottom-sheet';
import StorageAddBtn from 'src/components/storage/StorageAddBtn';
import StorageLinkBox from 'src/components/storage/StorageLinkBox';
import StorageMemoBox from 'src/components/storage/StorageMemoBox';

import 'src/styles/Storage.scss';

import { getInvitationById } from 'src/api/invitation';

function StorageIndex() {
  const dispatch = useDispatch<AppDispatch>();
  const { eventId } = useParams();
  const { open, data, setData, bottomSheetRef } =
    useOutletContext<StorageChildProps>();
  const { destroy: destroyStorageInput } = createStorageActions;
  const { destroy: destroyStorageCommentInput } = createCommentActions;

  const [event, setEvent] = useState<PendingEvent | BFixedEvent>();

  useEffect(() => {
    KezulerStorageInstance.get(`/storage/${eventId}`).then((res) => {
      setData(res.data);
    });
    if (eventId)
      getInvitationById(eventId).then((res) => {
        setEvent(res.data.result);
      });

    return () => {
      dispatch(destroyStorageInput());
      dispatch(destroyStorageCommentInput());
    };
  }, []);

  const reversedMemos = useMemo(() => {
    if (data) {
      const memos = data.storage?.memos;
      if (Array.isArray(memos)) return [...memos].reverse();
    }
  }, [data]);

  const reversedLinks = useMemo(() => {
    if (data) {
      const links = data.storage?.links;
      if (Array.isArray(links)) return [...links].reverse();
    }
  }, [data]);

  return (
    <div className="storage-wrapper">
      {reversedMemos?.map((el: any) => (
        <StorageMemoBox
          key={el._id}
          id={el._id}
          storageTitle={el.title}
          storageMemoContent={el.content}
        />
      ))}
      {reversedLinks?.map((el: any) => (
        <StorageLinkBox
          key={el._id}
          id={el._id}
          storageTitle={el.title}
          storageMetaImageUrl={el.metaImageUrl}
        />
      ))}
      <StorageAddBtn />
      <BottomSheet
        open={open}
        comments={data?.storage?.comments}
        event={event}
        setData={setData}
        bottomSheetRef={bottomSheetRef}
      />
    </div>
  );
}

export default StorageIndex;
