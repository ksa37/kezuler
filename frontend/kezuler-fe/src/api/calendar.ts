import KezulerInstance from 'src/constants/api';

const getCalendarLink = () => KezulerInstance.get('calendars/link');

const getCalendars = () => KezulerInstance.get('calendars');

const deleteCalendar = (eventId: string) =>
  KezulerInstance.delete(`calendars/${eventId}`);

const postCalendarHost = (eventId: string) =>
  KezulerInstance.post(`calendars/${eventId}/host`);

const deleteCalendarHost = (eventId: string) =>
  KezulerInstance.delete(`calendars/${eventId}/host`);

const getReCalendarLink = () => KezulerInstance.get('calendars/renewal');

export {
  getCalendarLink,
  getCalendars,
  deleteCalendar,
  postCalendarHost,
  deleteCalendarHost,
  getReCalendarLink,
};
