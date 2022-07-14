import React from 'react';
import Avatar from '@mui/material/Avatar';

interface Props {
  title: string;
  children: React.ReactNode;
  profileImageUrl?: string;
  profileImageAlt?: string;
}

function OverviewSection({
  title,
  children,
  profileImageAlt,
  profileImageUrl,
}: Props) {
  return (
    <section className={'overview-section'}>
      <div className={'overview-section-title'}>{title}</div>
      <div className={'overview-section-desc'}>{children}</div>
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

export default OverviewSection;
