import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import KezulerStorageInstance from 'src/constants/api-storage';
import PathName from 'src/constants/PathName';
import { alertAction } from 'src/reducers/alert';
import { AppDispatch } from 'src/store';
import { RStorage } from 'src/types/Storage';
import { isModification, isParticipant } from 'src/utils/joinMeeting';
import { isFixedEvent } from 'src/utils/typeGuard';

import StorageAddBtn from 'src/components/storage/StorageAddBtn';
import StorageLinkBox from 'src/components/storage/StorageLinkBox';
import StorageMemoBox from 'src/components/storage/StorageMemoBox';

import 'src/styles/Storage.scss';

import { getInvitationById } from 'src/api/invitation';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';

function StorageIndex() {
  const [data, setData] = useState<RStorage | null>(null);
  const { eventId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { show } = alertAction;
  const navigate = useNavigate();

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
  }, []);

  return (
    <div className="storage-wrapper">
      {data?.storage?.memos.reverse().map(({ _id, title, content }) => (
        <StorageMemoBox
          key={_id}
          id={_id}
          storageType={'memo'}
          storageTitle={title}
          storageMemoContent={content}
        />
      ))}
      {data?.storage?.links.reverse().map(({ _id, title, metaImageUrl }) => (
        <StorageLinkBox
          key={_id}
          id={_id}
          storageType={'link'}
          storageTitle={title}
          storageMetaImageUrl={metaImageUrl}
        />
      ))}
      <StorageAddBtn />
    </div>
  );
}

export default StorageIndex;
