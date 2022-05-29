// date to MM/dd
const dateToMMdd = (date: Date) => `${date.getMonth()}/${date.getDate()}`;

// date to daily time (오전 11:30)
const dateToDailyTime = (date: Date) => {
  const hours = date.getHours();
  const tempHour = hours > 12 ? hours - 12 : hours;
  const minutes = date.getMinutes();

  const hourText = `${tempHour < 10 ? '0' : ''}${tempHour}`;
  const minuteText = `${minutes < 10 ? '0' : ''}${minutes}`;
  return `${hours >= 12 ? '오후' : '오전'} ${hourText}:${minuteText}`;
};

const getDDay = (date: Date) => {
  const now = new Date();
  const interval = date.getTime() - now.getTime();
  const dDay = Math.ceil(interval / (1000 * 60 * 60 * 24));
  return dDay === 0 ? 'Today' : `D-${dDay}`;
};

const getMonthFromDateString = (dateString: string) =>
  new Date(dateString).getMonth();

export { dateToMMdd, dateToDailyTime, getDDay, getMonthFromDateString };
