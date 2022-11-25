import React, { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';

import KezulerStorageInstance from 'src/constants/api-storage';
import { StorageChildProps } from 'src/types/Storage';

import 'src/styles/Storage.scss';

function StorageMemo() {
  const [data, setData] = useState<any>(null);
  const { id } = useParams();
  const { setTextAppBarTitle } = useOutletContext<StorageChildProps>();

  useEffect(() => {
    setTextAppBarTitle(data?.memo?.title);
  }, [data?.memo?.title]);

  useEffect(() => {
    KezulerStorageInstance.get(`/memo/${id}`).then((res) => {
      setData(res.data);
    });
  }, []);

  return (
    <div className="storage-wrapper">
      <div className="storage-type-memo-content">{data?.memo?.content}</div>
    </div>
  );
}

export default StorageMemo;
