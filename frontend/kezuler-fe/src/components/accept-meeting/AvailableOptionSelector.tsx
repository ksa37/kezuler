import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonGroup, ClickAwayListener } from '@mui/material';
import classNames from 'classnames';

import { RootState } from 'src/reducers';
import { acceptMeetingActions } from 'src/reducers/AcceptMeeting';
import { AppDispatch } from 'src/store';

function AvailableOptionSelector() {
  const dispatch = useDispatch<AppDispatch>();
  const { isDecline, declineReason, availableTimes, pendingEvent } =
    useSelector((state: RootState) => state.acceptMeeting);
  const { eventTimeDuration, declinedUsers, eventTimeCandidates } =
    pendingEvent;
  const { setIsDecline, setDeclineReason } = acceptMeetingActions;

  const [isOpen, setIsOpen] = useState(false);

  const handleOutsideClick = () => {
    setIsOpen(false);
  };

  const handleNotAvailableClick = () => {
    setIsOpen(true);
    dispatch(setIsDecline(true));
  };

  const handleAllAvailableClick = () => {
    setIsOpen(false);
    dispatch(setIsDecline(false));
    dispatch(setDeclineReason(''));
  };

  const handleDeclineReasonChange = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    dispatch(setDeclineReason(event.target.value));
  };

  useEffect(() => {
    dispatch(setIsDecline(availableTimes.length === 0));
  }, [availableTimes]);

  const allAvailable = useMemo(
    () => availableTimes.length === eventTimeCandidates.length,
    [availableTimes]
  );
  console.log('allAvailable?', allAvailable);

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
            rows={5}
            className={'available-option-text-field'}
            value={declineReason || ''}
            maxLength={100}
            onChange={handleDeclineReasonChange}
            placeholder={notAvailableReasonDescription}
          />
        )}
      </div>
    </ClickAwayListener>
  );
}

export default AvailableOptionSelector;
