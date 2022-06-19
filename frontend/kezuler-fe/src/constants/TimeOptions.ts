// const TimeOptions: string[] = [];

import { isBefore } from 'date-fns';

// for (let i = 0; i < 24; i++) {
//   TimeOptions.push((i + ':00').padStart(5, '0'));
//   TimeOptions.push((i + ':30').padStart(5, '0'));
// }

const TimeOptions = (startDate: Date) => {
  const timeOptionList: string[] = [];
  const nowDate = new Date();
  // console.log(startDate, nowDate);
  for (let i = 0; i < 24; i++) {
    if (
      !isBefore(
        new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate(),
          i,
          0
        ),
        nowDate
      )
    ) {
      timeOptionList.push((i + ':00').padStart(5, '0'));
    }

    if (
      !isBefore(
        new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate(),
          i,
          30
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
