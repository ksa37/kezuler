import React from 'react';
import classNames from 'classnames';

interface Props {
  title: string;
  children: React.ReactNode;
  isEdit?: boolean;
  isError?: boolean;
  alignWith?: boolean;
}

function OverviewSection({
  title,
  children,
  isEdit,
  isError,
  alignWith,
}: Props) {
  return (
    <section
      className={classNames(
        'overview-section',
        { 'is-edit': isError ? false : isEdit },
        { 'is-error': isError }
      )}
    >
      <div className={'overview-section-title'}>
        {title}
        {alignWith && children}
      </div>
      {!alignWith && <div className={'overview-section-desc'}>{children}</div>}
    </section>
  );
}

export default OverviewSection;
