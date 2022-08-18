import { addDays, format, isAfter } from 'date-fns';
import { ko } from 'date-fns/locale';

import DAY_OF_WEEK from 'src/constants/DayofWeek';
import { EventTimeCandidate } from 'src/types/pendingEvent';
import { User } from 'src/types/user';

import getTimezoneDate, { getUTCDate } from './getTimezoneDate';

// api 의 모든 response (date string) 는 yyyy-MM-dd hh:mm:ss 형태로

const formatTwoDigits = (n: number) => (n < 10 ? `0${n}` : n);

// yyyy-MM-dd hh:mm:ss to yyyy-MM-dd
const parseDateString = (dateString: string) => {
  return dateString.split(' ')[0];
};

// date to MM/dd
const dateToMMdd = (date: Date) => `${date.getMonth() + 1}/${date.getDate()}`;

// date to daily time (오전 11:30)
const dateToDailyTime = (date: Date) => {
  const hours = date.getHours();
  const hourText = hours > 12 ? hours - 12 : hours;
  const minutes = date.getMinutes();

  const minuteText = formatTwoDigits(minutes);
  return `${hours >= 12 ? '오후' : '오전'} ${hourText}:${minuteText}`;
};

const getIntervalFromToday = (date: Date) => {
  const today = getTimezoneDate(new Date()).setHours(0, 0, 0, 0);
  const target = date.setHours(0, 0, 0, 0);
  return (today - target) / 86_400_000;
};

const getDDay = (date: Date) => {
  const interval = getIntervalFromToday(date);
  return `D ${interval > 0 ? '+' : '-'} ${Math.abs(interval)}`;
};

// 월 반환
const getMonthFromTimeStamp = (timeStamp?: number) => {
  if (!timeStamp) {
    return getTimezoneDate(new Date().getTime()).getMonth() + 1;
  }
  return getTimezoneDate(new Date(timeStamp).getTime()).getMonth() + 1;
};

// 한국 요일 반환
const getKorDay = (date: Date) => DAY_OF_WEEK[date.getDay()];

const getTimeRange = (startDate: Date, durationMinutes: number) => {
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
  return `${dateToDailyTime(startDate)} ~ ${dateToDailyTime(endDate)}`;
};

// date string => YYYY년 m월 dd일 오후(오전) HH:MM
const dateStringToKorDate = (timeStamp: number) => {
  const date = getTimezoneDate(new Date(timeStamp));
  return format(date, 'yyyy년 M월 d일 ') + dateToDailyTime(date);
};

// [Date, Date, Date]  => {M/d EEE: [Date, Date, Date, ...]   }
type EventTimeListByDate = { [date: string]: Date[] };
const getTimeListDevideByDate = (eventTimeList: Date[]) => {
  const eventTimeListByDate: EventTimeListByDate = {};

  for (let i = 0; i < eventTimeList.length; i++) {
    const dateAndDay = format(eventTimeList[i], 'M/d EEE', {
      locale: ko,
    });
    if (!eventTimeListByDate[dateAndDay]) {
      eventTimeListByDate[dateAndDay] = [];
    }
    eventTimeListByDate[dateAndDay].push(eventTimeList[i]);
  }
  return eventTimeListByDate;
};

type EventTimeListByDateWithPossibleNum = {
  [date: string]: EventTimeListWithPossibleNum[];
};
type EventTimeListWithPossibleNum = {
  eventStartsAt: Date;
  possibleNum: number;
};
// [[Date, num], [Date, num], [Date, num]]  => {M/d EEE: [[Date, num], [Date, num], [Date, num], …]   }
const getTimeListDevideByDateWithPossibleNum = (
  eventTimeListWithPossibleNums: EventTimeListWithPossibleNum[]
) =>
  eventTimeListWithPossibleNums.reduce<EventTimeListByDateWithPossibleNum>(
    (prev, e) => {
      const dateAndDay = format(e.eventStartsAt, 'M/d EEE', {
        locale: ko,
      });
      if (!prev[dateAndDay]) {
        prev[dateAndDay] = [];
      }
      prev[dateAndDay].push(e);
      return prev;
    },
    {}
  );

// [[Date, num], [Date, num], [Date, num]]  => {M/d EEE: [[Date, users], …]   }
type EventTimeListWithPossibleUser = {
  eventStartsAt: Date;
  possibleUsers: User[];
};
type EventTimeListByDateWithPossibleUser = {
  [date: string]: EventTimeListWithPossibleUser[];
};
const getTimeListDivideByDateWithPossibleUsers = (
  eventCandidates: EventTimeCandidate[]
) =>
  eventCandidates.reduce<EventTimeListByDateWithPossibleUser>(
    (prev, eventCandidate) => {
      const { eventStartsAt, possibleUsers } = eventCandidate;
      const date = getTimezoneDate(new Date(eventStartsAt).getTime());
      const dateAndDay = format(date, 'M/d EEE', {
        locale: ko,
      });
      if (!prev[dateAndDay]) {
        prev[dateAndDay] = [];
      }
      prev[dateAndDay].push({
        eventStartsAt: date,
        possibleUsers,
      });
      return prev;
    },
    {}
  );

// "2022-06-09T16:30:00.000Z" to "2022-06-09 16:30:00"
const isoStringToDateString = (isoString: string) => {
  const date = isoString.split('T')[0];
  const fullTime = isoString.split('T')[1];
  const time = ''.concat(
    ...fullTime.split(':').slice(0, 1),
    ':',
    ...fullTime.split(':').slice(1, 2)
  );
  console.log(date + ' ' + time);
  return date + ' ' + time;
};

// const getEventTimeCandidatesFromDateStrings = (eventTimeList: string[]) => {
//   const eventTimeCandidates: EventTimeCandidate[] = eventTimeList.map(
//     (dateStr) => {
//       return {
//         eventStartsAt: isoStringToDateString(dateStr),
//         possibleUsers: [],
//       };
//     }
//   );
//   return eventTimeCandidates;
// };

// 같은 날짜인지 체크
const isSameDate = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const setMindate = () => {
  const nowTime = getTimezoneDate(new Date().getTime());
  // yyyy-mm-dd hh:mm:00 형태로
  // console.log(
  //   getTimezoneDate(new Date().getTime()).getTime(),
  //   new Date().getTime()
  // );
  // console.log(getTimezoneDate(new Date().getTime()), new Date());

  const eleven30 = `${String(nowTime.getFullYear())}-${String(
    nowTime.getMonth() + 1
  ).padStart(2, '0')}-${String(nowTime.getDate()).padStart(2, '0')} 23:30:00`;

  const nextDay = addDays(nowTime, 1);
  const toNextDate = `${String(nextDay.getFullYear())}-${String(
    nextDay.getMonth() + 1
  ).padStart(2, '0')}-${String(nextDay.getDate()).padStart(2, '0')} 00:00:00`;

  if (isAfter(new Date(), getUTCDate(eleven30))) {
    return getTimezoneDate(getUTCDate(toNextDate));
  } else {
    return getTimezoneDate(new Date().getTime());
  }
};

export {
  dateStringToKorDate,
  parseDateString,
  dateToMMdd,
  dateToDailyTime,
  getIntervalFromToday,
  getDDay,
  getMonthFromTimeStamp,
  getKorDay,
  getTimeRange,
  getTimeListDevideByDate,
  getTimeListDevideByDateWithPossibleNum,
  getTimeListDivideByDateWithPossibleUsers,
  // getEventTimeCandidatesFromDateStrings,
  isoStringToDateString,
  isSameDate,
  setMindate,
};
