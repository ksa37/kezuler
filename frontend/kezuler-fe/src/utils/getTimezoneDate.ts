import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';

const getTimezoneDate = (date: string | number | Date) => {
  const timeZone = getCurrentUserInfo()?.userTimezone;
  if (timeZone !== undefined) {
    return utcToZonedTime(date, timeZone);
  } else {
    return new Date(date);
  }
};

const getUTCDate = (date: string | number | Date) => {
  const timeZone = getCurrentUserInfo()?.userTimezone;
  if (timeZone !== undefined) {
    return zonedTimeToUtc(date, timeZone);
  } else {
    return new Date(date);
  }
};

export default getTimezoneDate;
export { getUTCDate };
