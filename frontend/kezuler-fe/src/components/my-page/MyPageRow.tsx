import React from 'react';

interface Props {
  onClick?: () => void;
  href?: string;
  title: string;
  startIcon: React.ReactElement;
  children?: React.ReactNode;
}

function MyPageRow({ onClick, href, title, startIcon, children }: Props) {
  return (
    <div className={'my-page-row'}>
      {href ? (
        <a
          className={'my-page-row-main'}
          href={href}
          {...(onClick ? { onClick } : { target: '_blank', rel: 'noreferrer' })}
        >
          {startIcon}
          {title}
        </a>
      ) : onClick ? (
        <button
          className={'my-page-row-main'}
          type={'button'}
          onClick={onClick}
        >
          {startIcon}
          {title}
        </button>
      ) : (
        <div className={'my-page-row-main'}>
          {startIcon}
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

export default MyPageRow;
