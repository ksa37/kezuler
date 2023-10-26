import React from 'react';
import Avatar from '@mui/material/Avatar';
import classNames from 'classnames';

interface Props {
  hostName: string;
  profileImageUrl?: string;
  profileImageAlt: string;
}

function OverviewHost({ hostName, profileImageUrl, profileImageAlt }: Props) {
  return (
    <section className={classNames('overview-section')}>
      <div className={'overview-section-title'}>주최자</div>
      <div className={'overview-section-desc profile'}>{hostName}</div>
      {profileImageUrl && (
        <Avatar
          className={'overview-section-avatar'}
          alt={profileImageAlt}
          src={profileImageUrl}
        />
      )}
    </section>
  );
}

export default OverviewHost;
