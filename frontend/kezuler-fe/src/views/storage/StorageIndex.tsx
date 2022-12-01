import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';

import KezulerStorageInstance from 'src/constants/api-storage';
import { createStorageActions } from 'src/reducers/CreateStorage';
import { AppDispatch } from 'src/store';
import { StorageChildProps } from 'src/types/Storage';

import StorageAddBtn from 'src/components/storage/StorageAddBtn';
import StorageLinkBox from 'src/components/storage/StorageLinkBox';
import StorageMemoBox from 'src/components/storage/StorageMemoBox';

import 'src/styles/Storage.scss';

function StorageIndex() {
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState<any>(null);
  const { eventId } = useParams();
  const { setTextAppBarTitle } = useOutletContext<StorageChildProps>();
  const { destroy: destroyStorageInput } = createStorageActions;

  useEffect(() => {
    setTextAppBarTitle('test');
    KezulerStorageInstance.get(`/storage/${eventId}`).then((res) => {
      setData(res.data);
    });
    return () => {
      dispatch(destroyStorageInput());
    };
  }, []);

  const reversedMemos = useMemo(() => {
    if (data) {
      const memos = data?.storage?.memos;
      return [...memos].reverse();
    }
  }, [data]);

  const reversedLinks = useMemo(() => {
    if (data) {
      const links = data?.storage?.links;
      return [...links].reverse();
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
    </div>
  );
}

export default StorageIndex;
