import React from 'react';

interface Props {
  children: React.ReactNode;
}

function CommonAppBar({ children }: Props) {
  return <header className={'common-app-bar'}>{children}</header>;
}

export default CommonAppBar;
