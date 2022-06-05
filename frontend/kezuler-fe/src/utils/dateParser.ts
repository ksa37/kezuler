import DAY_OF_WEEK from 'src/constants/DayofWeek';

// api 의 모든 response 는 yyyy-MM-dd hh:mm:ss 형태로

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

export {
  parseDateString,
  dateToMMdd,
  dateToDailyTime,
  getDDay,
  getMonthFromDateString,
  getKorDay,
  getTimeRange,
};
