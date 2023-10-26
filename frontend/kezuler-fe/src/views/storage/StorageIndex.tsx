import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

import KezulerStorageInstance from 'src/constants/api-storage';
import PathName from 'src/constants/PathName';
import { alertAction } from 'src/reducers/alert';
import { createCommentActions } from 'src/reducers/CreateComment';
import { createStorageActions } from 'src/reducers/CreateStorage';
import { AppDispatch } from 'src/store';
import { BFixedEvent } from 'src/types/fixedEvent';
import { PendingEvent } from 'src/types/pendingEvent';
import { RStorage, StorageChildProps } from 'src/types/Storage';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';
import { isModification, isParticipant } from 'src/utils/joinMeeting';
import { isFixedEvent } from 'src/utils/typeGuard';

import BottomSheet from 'src/components/bottom-sheet';
import StorageAddBtn from 'src/components/storage/StorageAddBtn';
import StorageLinkBox from 'src/components/storage/StorageLinkBox';
import StorageMemoBox from 'src/components/storage/StorageMemoBox';

import 'src/styles/Storage.scss';

import { getInvitationById } from 'src/api/invitation';

function StorageIndex() {
  const dispatch = useDispatch<AppDispatch>();
  const { eventId } = useParams();
  const { show } = alertAction;
  const navigate = useNavigate();
  const { open, data, setData, bottomSheetRef } =
    useOutletContext<StorageChildProps>();
  const { destroy: destroyStorageInput } = createStorageActions;
  const { destroy: destroyStorageCommentInput } = createCommentActions;
  const { setTextAppBarTitle } = useOutletContext<StorageChildProps>();

  const [event, setEvent] = useState<PendingEvent | BFixedEvent>();

  useEffect(() => {
    if (eventId) {
      getInvitationById(eventId).then((res) => {
        const event = res.data.result;
        let isJoining;
        const isHost = event.eventHost.userId === getCurrentUserInfo()?.userId;
        if (isFixedEvent(event)) {
          isJoining = isParticipant(event.participants);
        } else {
          isJoining = isModification(
            event.eventTimeCandidates,
            event.declinedUsers
          );
        }
        if (isHost || isJoining) {
          KezulerStorageInstance.get<RStorage>(`/storage/${eventId}`).then(
            (res) => {
              setData(res.data);
              setEvent(event);
              setTextAppBarTitle(event.eventTitle);
            }
          );
        } else {
          dispatch(
            show({
              title: '보관함 열람 불가',
              description: '해당 미팅에 참여중이어야 열람이 가능합니다.',
            })
          );
          navigate(PathName.mainFixed, { replace: true });
        }
      });
    }
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
          storageType="memo"
          id={el._id}
          storageTitle={el.title}
          storageMemoContent={el.content}
        />
      ))}
      {reversedLinks?.map((el: any) => (
        <StorageLinkBox
          key={el._id}
          storageType="link"
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
