import KezulerInstance from 'src/constants/api';
import { PGetCalendarByDay } from 'src/types/calendar';

const getCalendarLink = () => KezulerInstance.get('calendars/link');

const getGoogleAccount = (code: string) =>
  KezulerInstance.get(`/calendars/google?code=${code}`);

const getCalendars = (params: PGetCalendarByDay) => {
  return KezulerInstance.get(
    `calendars?year=${params.year}&month=${params.month}&day=${params.day}`
  );
};

const deleteCalendarEvent = (eventId: string) =>
  KezulerInstance.delete(`calendars/${eventId}`);

const postCalendarHost = (eventId: string) =>
  KezulerInstance.post(`calendars/${eventId}/host`);

const deleteCalendarHost = (eventId: string) =>
  KezulerInstance.delete(`calendars/${eventId}/host`);

const getReCalendarLink = () => KezulerInstance.get('calendars/renewal');

const deleteCalendarConnect = () => KezulerInstance.delete('calendars');

export {
  getCalendarLink,
  getGoogleAccount,
  getCalendars,
  deleteCalendarEvent,
  postCalendarHost,
  deleteCalendarHost,
  getReCalendarLink,
  deleteCalendarConnect,
};
