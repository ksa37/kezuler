import React from 'react';
import ReactDOM from 'react-dom';

interface Props {
  children: React.ReactNode;
}

function PortalWrapper({ children }: Props) {
  const appWrapper = document.getElementById('app-wrapper');

  return appWrapper ? ReactDOM.createPortal(children, appWrapper) : null;
}

export default PortalWrapper;
