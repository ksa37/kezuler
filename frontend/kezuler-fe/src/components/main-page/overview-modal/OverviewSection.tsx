import React from 'react';
import classNames from 'classnames';

interface Props {
  title: string;
  children: React.ReactNode;
  isEdit?: boolean;
  isError?: boolean;
}

function OverviewSection({ title, children, isEdit, isError }: Props) {
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
    </section>
  );
}

export default OverviewSection;
