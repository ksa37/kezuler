import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { isBefore, isSameSecond } from 'date-fns';

import { REMINDER_OPTIONS } from 'src/constants/Main';
import { alertAction } from 'src/reducers/alert';
// import { usePutReminder } from 'src/hooks/useReminder';
import { AppDispatch } from 'src/store';
import { Reminder } from 'src/types/reminder';

import KezulerDropdown from 'src/components/common/KezulerDropdown';

// import { ReactComponent as ClockIcon } from 'src/assets/clock_icon.svg';
import { ReactComponent as ArrowDownIcon } from 'src/assets/icn_dn_outline.svg';

import { getGuestReminder, patchGuestReminder } from 'src/api/fixedEvent';

interface Props {
  eventId: string;
  eventStartsAt: number;
}
function OverviewDropdown({ eventId, eventStartsAt }: Props) {
  const [selectedIdx, setSelectedIdx] = useState(2);
  const dispatch = useDispatch<AppDispatch>();
  const { show } = alertAction;

  // const getReminder = useGetReminder();
  useEffect(() => {
    let reminder: Reminder;
    getGuestReminder(eventId)
      .then((res) => {
        reminder = res.data;
        const targetIdx = REMINDER_OPTIONS.findIndex(
          (t) => t.hours === reminder.result
        );
        if (targetIdx !== -1) {
          setSelectedIdx(targetIdx);
        }
      })
      .catch((err) => {
        console.log('리마인더 에러', err);
        dispatch(
          show({
            title: '리마인더 오류',
            description: '리마인더를 가져올 수 없습니다.',
          })
        );
      });
  }, [eventId]);

  const handleChangeReminder = (newIdx: number) => {
    const seletedMinutes = REMINDER_OPTIONS[newIdx].hours;

    patchGuestReminder(eventId, { remindDate: seletedMinutes })
      .then((res) => {
        setSelectedIdx(newIdx);
        console.log(res.data);
      })
      .catch((err) => {
        console.log('리마인더 에러', err);
        dispatch(
          show({
            title: '리마인더 오류',
            description: '리마인더를 바꿀수 없습니다.',
          })
        );
      });
  };

  const checkReminderTime = (hours: number) => {
    return !isBefore(
      eventStartsAt - hours * 60 * 60 * 1000,
      new Date().getTime()
    );
  };

  const disabledIdxs = REMINDER_OPTIONS.reduce((acc, cur, idx) => {
    if (!checkReminderTime(cur.hours)) return acc.concat(idx);
    else return acc;
  }, [] as number[]);

  return (
    <KezulerDropdown
      // title={'리마인더 설정'}
      paperClassName={'overview-dropdown-paper'}
      titleClassName={'overview-dropdown-title'}
      buttonClassName={'overview-dropdown-button'}
      menuClassName={'overview-dropdown-menu'}
      selectedMenuClassName={'selected'}
      menuListClassName={'overview-dropdown-menu-list'}
      menuData={REMINDER_OPTIONS}
      displayKey={'display'}
      selectedIdx={selectedIdx}
      setSelectedIdx={handleChangeReminder}
      disabledIdxs={disabledIdxs}
      // endIcon={<ClockIcon className={'overview-dropdown-icon'} />}
      popperBottomStart
      endIcon={<ArrowDownIcon className={'overview-dropdown-icon'} />}
    />
  );
}

export default OverviewDropdown;
