import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import classNames from 'classnames';

import KezulerStorageInstance from 'src/constants/api-storage';
import { StorageChildProps } from 'src/types/Storage';

import WarningImg from 'src/assets/image/warning.png';
import 'src/styles/Storage.scss';

function StorageLink() {
  const [data, setData] = useState<any>(null);
  const { id } = useParams();
  const { setTextAppBarTitle } = useOutletContext<StorageChildProps>();

  useEffect(() => {
    setTextAppBarTitle(data?.link?.title);
  }, [data?.link?.title]);

  useEffect(() => {
    KezulerStorageInstance.get(`/link/${id}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((res) => console.log(res));
  }, []);

  const handleLinkClick = () => {
    location.href = data.link.url;
  };

  const handleImgError = (e: any) => {
    e.target.src = WarningImg;
  };

  return (
    <div className={classNames('storage-wrapper', 'flex-column')}>
      <div onClick={handleLinkClick} className="storage-og-wrapper">
        <img
          onError={handleImgError}
          className="storage-og-image"
          src={
            data?.link?.metaImageUrl !== ''
              ? data?.link?.metaImageUrl
              : WarningImg
          }
        />
        <h4 className="storage-og-title">{data?.link?.metaTitle}</h4>
        <div className="storage-og-desc">{data?.link?.metaDesc}</div>
        <a className="storage-og-url" href={data?.link?.url}>
          {data?.link?.url}
        </a>
      </div>
    </div>
  );
}

export default StorageLink;
