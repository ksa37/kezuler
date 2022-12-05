import React, { SetStateAction, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

import KezulerStorageInstance from 'src/constants/api-storage';
import { RStorage, StorageChildProps } from 'src/types/Storage';

import StorageAddBtn from 'src/components/storage/StorageAddBtn';
import StorageLinkBox from 'src/components/storage/StorageLinkBox';
import StorageMemoBox from 'src/components/storage/StorageMemoBox';

import 'src/styles/Storage.scss';

function StorageIndex() {
  const [data, setData] = useState<RStorage | null>(null);
  const { eventId } = useParams();
  const { setTextAppBarTitle } = useOutletContext<StorageChildProps>();

  useEffect(() => {
    setTextAppBarTitle('test');
    KezulerStorageInstance.get<RStorage>(`/storage/${eventId}`).then((res) => {
      setData(res.data);
    });
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
