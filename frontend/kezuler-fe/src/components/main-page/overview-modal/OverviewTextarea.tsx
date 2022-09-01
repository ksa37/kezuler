import React, { useEffect, useState } from 'react';
import { isIOS, isMobile } from 'react-device-detect';
import { FieldError, FieldPath, UseFormRegisterReturn } from 'react-hook-form';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import classNames from 'classnames';

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
  const [focused, setFocused] = useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

  function preventIOSScroll() {
    const focusedInput = document.activeElement as
      | HTMLInputElement
      | HTMLTextAreaElement;
    focusedInput?.blur();
  }

  function disable() {
    document
      .querySelector('.App')
      ?.addEventListener('touchmove', preventIOSScroll);
  }

  function enable() {
    document
      .querySelector('.App')
      ?.removeEventListener('touchmove', preventIOSScroll);
  }

  useEffect(() => {
    if (isMobile && isIOS) {
      if (focused) {
        disable();
      } else {
        enable();
      }
    }
  }, [focused]);

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
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {error && <div className={'overview-error-text'}>{error.message}</div>}
    </div>
  );
}

export default OverviewTextarea;
