import React from 'react';
import Avatar from '@mui/material/Avatar';
import classNames from 'classnames';

interface Props {
  title: string;
  children: React.ReactNode;
  profileImageUrl?: string;
  profileImageAlt?: string;
  isEdit?: boolean;
  isError?: boolean;
}

function OverviewSection({
  title,
  children,
  profileImageAlt,
  profileImageUrl,
  isEdit,
  isError,
}: Props) {
  return (
    <section
      className={classNames(
        'overview-section',
        { 'is-edit': isError ? false : isEdit },
        { 'is-error': isError }
      )}
    >
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
