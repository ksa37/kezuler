import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import DAY_OF_WEEK from 'src/constants/DayofWeek';

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

const getDDay = (date: Date) => {
  const now = new Date();
  const interval = date.getTime() - now.getTime();
  const dDay = Math.ceil(interval / (1000 * 60 * 60 * 24));
  return dDay === 0 ? 'Today' : `D-${dDay}`;
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
// [[Date, num], [Date, num], [Date, num]]  => {M/d EEE: [[Date, num], [Date, num], [Date, num], ...]   }
const getTimeListDevideByDateWithPossibleNum = (
  eventTimeListWithPossibleNums: EventTimeListWithPossibleNum[]
) => {
  const eventTimeListByDate: EventTimeListByDateWithPossibleNum = {};

  for (let i = 0; i < eventTimeListWithPossibleNums.length; i++) {
    const dateAndDay = format(
      eventTimeListWithPossibleNums[i].eventStartsAt,
      'M/d EEE',
      {
        locale: ko,
      }
    );
    if (!eventTimeListByDate[dateAndDay]) {
      eventTimeListByDate[dateAndDay] = [];
    }
    eventTimeListByDate[dateAndDay].push(eventTimeListWithPossibleNums[i]);
  }
  return eventTimeListByDate;
};

export {
  dateStringToKorDate,
  parseDateString,
  dateToMMdd,
  dateToDailyTime,
  getDDay,
  getMonthFromDateString,
  getKorDay,
  getTimeRange,
  getTimeListDevideByDate,
  getTimeListDevideByDateWithPossibleNum,
};
