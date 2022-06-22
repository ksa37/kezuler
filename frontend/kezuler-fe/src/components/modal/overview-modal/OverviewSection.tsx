import React from 'react';
import { Avatar } from '@mui/material';

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
      <h2 className={'overview-section-title'}>{title}</h2>
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
