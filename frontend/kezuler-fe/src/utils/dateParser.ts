import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import DAY_OF_WEEK from 'src/constants/DayofWeek';
import { EventTimeCandidate } from 'src/types/pendingEvent';
import { User } from 'src/types/user';

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
  const today = new Date().setHours(0, 0, 0, 0);
  const target = new Date(date).setHours(0, 0, 0, 0);
  return (today - target) / 86_400_000;
};

const getDDay = (date: Date) => {
  const interval = getIntervalFromToday(date);
  return `D ${interval > 0 ? '+' : '-'} ${Math.abs(interval)}`;
};

// 월 반환
const getMonthFromDateString = (dateString?: string) => {
  if (!dateString) {
    return new Date().getMonth() + 1;
  }
  return new Date(dateString).getMonth() + 1;
};

// 한국 요일 반환
const getKorDay = (date: Date) => DAY_OF_WEEK[date.getDay()];

const getTimeRange = (startDate: Date, durationMinutes: number) => {
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

  return `${dateToDailyTime(startDate)} ~ ${dateToDailyTime(endDate)}`;
};

// date string => YYYY년 m월 dd일 오후(오전) HH:MM
const dateStringToKorDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일 ${dateToDailyTime(date)}`;
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
      const date = new Date(eventStartsAt);
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

export {
  dateStringToKorDate,
  parseDateString,
  dateToMMdd,
  dateToDailyTime,
  getIntervalFromToday,
  getDDay,
  getMonthFromDateString,
  getKorDay,
  getTimeRange,
  getTimeListDevideByDate,
  getTimeListDevideByDateWithPossibleNum,
  getTimeListDivideByDateWithPossibleUsers,
  // getEventTimeCandidatesFromDateStrings,
  isoStringToDateString,
  isSameDate,
};
