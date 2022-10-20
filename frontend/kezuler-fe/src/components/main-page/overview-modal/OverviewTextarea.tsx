import React from 'react';
import { FieldError, FieldPath, UseFormRegisterReturn } from 'react-hook-form';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import classNames from 'classnames';

import useIOSScroll from 'src/hooks/useIOSScroll';
import { OverviewEventForm } from 'src/types/Overview';

interface Props {
  textareaClassName: string;
  error?: FieldError;
  placeholder?: string;
  registered: UseFormRegisterReturn<FieldPath<OverviewEventForm>>;
  defaultValue?: string;
  allowNewLine?: boolean;
}

function OverviewTextarea({
  textareaClassName,
  error,
  placeholder,
  registered,
  defaultValue,
  allowNewLine,
}: Props) {
  useIOSScroll();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!allowNewLine && e.code === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div className={'overview-input-container'}>
      <TextareaAutosize
        className={classNames(textareaClassName, {
          error: error,
        })}
        onKeyDown={handleKeyDown}
        defaultValue={defaultValue}
        {...registered}
        placeholder={placeholder}
      />
      {error && <div className={'overview-error-text'}>{error.message}</div>}
    </div>
  );
}

export default OverviewTextarea;
