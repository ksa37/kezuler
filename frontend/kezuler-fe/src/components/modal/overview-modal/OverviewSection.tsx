import React from 'react';
import { Avatar } from '@mui/material';

interface Props {
  title: string;
  children: React.ReactNode;
  profileImageUrl?: string;
}

function OverviewSection({ title, children, profileImageUrl }: Props) {
  return (
    <section className={'overview-section'}>
      <h2 className={'overview-section-title'}>{title}</h2>
      <div className={'overview-section-desc'}>{children}</div>
      {profileImageUrl && (
        <Avatar
          className={'overview-section-avatar'}
          alt={profileImageUrl}
          src={profileImageUrl}
        />
      )}
    </section>
  );
}

export default OverviewSection;
