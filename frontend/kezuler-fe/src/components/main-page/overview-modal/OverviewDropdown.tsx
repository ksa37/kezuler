import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { REMINDER_OPTIONS } from 'src/constants/Main';
// import { usePutReminder } from 'src/hooks/useReminder';
import { dialogAction } from 'src/reducers/dialog';
import { AppDispatch } from 'src/store';
import { Reminder } from 'src/types/reminder';

import KezulerDropdown from 'src/components/common/KezulerDropdown';

import { ReactComponent as ClockIcon } from 'src/assets/clock_icon.svg';

import { getGuestReminder, putGuestReminder } from 'src/api/fixedEvent';

interface Props {
  eventId: string;
}
function OverviewDropdown({ eventId }: Props) {
  const [selectedIdx, setSelectedIdx] = useState(2);
  const dispatch = useDispatch<AppDispatch>();
  const { show } = dialogAction;
  // const putReminder = usePutReminder();
  // 화면 진입 시 선택되어있는 리마인더 찾아옴
  // useEffect(() => {
  //   let reminder: Reminder;
  //   getGuestReminder(eventId)
  //     .then((res) => {
  //       reminder = res.data;
  //     })
  //     .catch((err) => {
  //       console.log('리마인더 에러', err);
  //       dispatch(
  //         show({
  //           title: '리마인더 오류',
  //           description: '리마인더를 가져올 수 없습니다.',
  //         })
  //       );
  //     });
  //   const targetIdx = REMINDER_OPTIONS.findIndex(
  //     (t) => t.minutes === reminder.timeDelta
  //   );
  //   if (targetIdx !== -1) {
  //     setSelectedIdx(targetIdx);
  //   }
  // }, [eventId]);

  const handleChangeReminder = (newIdx: number) => {
    const seletedMinutes = REMINDER_OPTIONS[newIdx].minutes;

    putGuestReminder(eventId, { timeDelta: seletedMinutes })
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

  return (
    <KezulerDropdown
      title={'리마인더 설정'}
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
      endIcon={<ClockIcon className={'overview-dropdown-icon'} />}
    />
  );
}

export default OverviewDropdown;
