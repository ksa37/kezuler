import React, { SetStateAction, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

import KezulerStorageInstance from 'src/constants/api-storage';
import { StorageChildProps } from 'src/types/Storage';

import StorageAddBtn from 'src/components/storage/StorageAddBtn';
import StorageLinkBox from 'src/components/storage/StorageLinkBox';
import StorageMemoBox from 'src/components/storage/StorageMemoBox';

import 'src/styles/Storage.scss';

function StorageIndex() {
  const [data, setData] = useState<any>(null);
  const { eventId } = useParams();
  const { setTextAppBarTitle } = useOutletContext<StorageChildProps>();

  useEffect(() => {
    setTextAppBarTitle('test');
    KezulerStorageInstance.get(`/storage/${eventId}`).then((res) => {
      setData(res.data);
    });
  }, []);
  console.log(data?.storage?.links);
  return (
    <div className="storage-wrapper">
      {data?.storage?.memos.reverse().map((el: any) => (
        <StorageMemoBox
          key={el._id}
          id={el._id}
          storageType={'memo'}
          storageTitle={el.title}
          storageMemoContent={el.content}
        />
      ))}
      {data?.storage?.links.reverse().map((el: any) => (
        <StorageLinkBox
          key={el._id}
          id={el._id}
          storageType={'link'}
          storageTitle={el.title}
          storageMetaImageUrl={el.metaImageUrl}
        />
      ))}
      <StorageAddBtn />
    </div>
  );
}

export default StorageIndex;
