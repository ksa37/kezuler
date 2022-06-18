import React from 'react';
import classNames from 'classnames';

interface Props {
  icon: JSX.Element;
  onClick?: () => void;
  text?: string;
  className?: string;
  type?: 'button' | 'submit';
  formId?: string;
}

function OverviewButton({
  icon,
  onClick,
  text,
  className,
  type = 'button',
  formId,
}: Props) {
  return (
    <button
      type={type}
      form={formId}
      className={classNames('overview-btn', className)}
      onClick={onClick}
    >
      <div className={'overview-btn-icon'}>{icon}</div>
      {text}
    </button>
  );
}

export default OverviewButton;
