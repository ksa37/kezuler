import React from 'react';
import classNames from 'classnames';

interface Props {
  icon: JSX.Element;
  onClick?: () => void;
  text?: string;
  textBtm?: string;
  className?: string;
  type?: 'button' | 'submit';
  formId?: string;
  disabled?: boolean;
}

function OverviewButton({
  icon,
  onClick,
  text,
  textBtm,
  className,
  type = 'button',
  formId,
  disabled,
}: Props) {
  return (
    <button
      type={type}
      form={formId}
      className={classNames('overview-btn', className, {
        disabled: disabled,
      })}
      onClick={onClick}
    >
      <div className={'overview-btn-icon'}>{icon}</div>
      {text}
      {textBtm && (
        <>
          <br /> {textBtm}
        </>
      )}
    </button>
  );
}

export default OverviewButton;
