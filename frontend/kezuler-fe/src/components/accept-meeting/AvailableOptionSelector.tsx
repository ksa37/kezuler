import React, { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import classNames from 'classnames';

import useIOSScroll from 'src/hooks/useIOSScroll';
import { RootState } from 'src/reducers';
import { acceptMeetingActions } from 'src/reducers/AcceptMeeting';
import { AppDispatch } from 'src/store';
interface Props {
  errorMessage: string;
}

function AvailableOptionSelector({ errorMessage }: Props) {
  useIOSScroll();

  const dispatch = useDispatch<AppDispatch>();
  const { isDecline, declineReason, availableTimes, pendingEvent } =
    useSelector((state: RootState) => state.acceptMeeting);
  const { eventTimeCandidates } = pendingEvent;
  const {
    setIsDecline,
    setDeclineReason,
    clearAvailableTimes,
    setAllAvailableTimes,
  } = acceptMeetingActions;

  const [isOpen, setIsOpen] = useState(false);

  const handleOutsideClick = () => {
    setIsOpen(false);
  };

  const handleNotAvailableClick = () => {
    setIsOpen(true);
    dispatch(setIsDecline(true));
    dispatch(clearAvailableTimes());
  };

  const handleAllAvailableClick = () => {
    if (availableTimes.length === eventTimeCandidates.length) {
      setAllAvailable(false);
      dispatch(clearAvailableTimes());
    } else {
      setIsOpen(false);
      dispatch(setIsDecline(false));
      dispatch(setDeclineReason(''));
      setAllAvailable(true);
      dispatch(setAllAvailableTimes());
    }
  };

  const handleDeclineReasonChange = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    dispatch(setDeclineReason(event.target.value));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.code === 'Enter') {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (availableTimes.length > 0) {
      dispatch(setIsDecline(false));
    }
    setAllAvailable(availableTimes.length === eventTimeCandidates.length);
  }, [availableTimes]);

  useEffect(() => {
    if (isDecline) setIsOpen(true);
  }, [isDecline]);

  const [allAvailable, setAllAvailable] = useState(false);

  // useMemo(
  //   () => setAllAvailable(availableTimes.length === eventTimeCandidates.length),
  //   [availableTimes]
  // );

  const notAvailableDescription = '가능한 시간이 없어요';
  const allAvailableDescription = '모든 시간 가능해요';
  const notAvailableReasonDescription =
    '시간이 안되는 이유 또는 가능한 시간을 미팅 호스트에게 알려주세요.(선택사항, 100자 이내)';

  return (
    <ClickAwayListener onClickAway={handleOutsideClick}>
      <div
        className={classNames('available-option-selector', {
          opened: isOpen,
        })}
      >
        <ButtonGroup
          classes={{ root: 'available-option-btn-group' }}
          disableElevation
        >
          <Button
            classes={{
              root: 'available-option-btn',
              contained: 'selected',
            }}
            className={classNames({
              blurred: !isDecline,
              selected: isDecline,
            })}
            variant={isDecline ? 'contained' : 'outlined'}
            onClick={handleNotAvailableClick}
          >
            <b>{notAvailableDescription}</b>
          </Button>
          <Button
            classes={{
              root: 'available-option-btn',
              contained: 'selected',
            }}
            className={classNames({
              blurred: !allAvailable,
              selected: allAvailable,
            })}
            variant={allAvailable ? 'contained' : 'outlined'}
            onClick={handleAllAvailableClick}
          >
            <b>{allAvailableDescription}</b>
          </Button>
        </ButtonGroup>
        {isOpen && (
          <textarea
            className={classNames('available-option-text-field', {
              error: errorMessage,
            })}
            placeholder={notAvailableReasonDescription}
            value={declineReason || ''}
            onKeyDown={handleKeyDown}
            onChange={handleDeclineReasonChange}
          />
        )}
        {isDecline &&
          isOpen &&
          (errorMessage ? (
            <div className={'create-meeting-error-text'}>{errorMessage}</div>
          ) : (
            <div
              className={classNames('create-meeting-error-text', 'no-error')}
            />
          ))}
      </div>
    </ClickAwayListener>
  );
}

export default AvailableOptionSelector;
