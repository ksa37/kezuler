import { isBefore } from 'date-fns';

import { getUTCDate } from 'src/utils/getTimezoneDate';

const TimeOptions = (startDate: Date) => {
  const timeOptionList: string[] = [];
  const nowDate = new Date().getTime();

  for (let i = 0; i < 24; i++) {
    if (
      !isBefore(
        getUTCDate(
          new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
            i,
            0
          ).getTime()
        ),
        nowDate
      )
    ) {
      timeOptionList.push((i + ':00').padStart(5, '0'));
    }

    if (
      !isBefore(
        getUTCDate(
          new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
            i,
            30
          ).getTime()
        ),
        nowDate
      )
    ) {
      timeOptionList.push((i + ':30').padStart(5, '0'));
    }
  }
  return timeOptionList;
};
export default TimeOptions;
