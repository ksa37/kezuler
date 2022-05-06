interface UserFixedEvents {
  userId: string;
  startDate: string;
  endDate: string;
  fixedEvents: FixedEvent[];
}

interface FixedEvent {
  userId?: string;
  eventId: string;
  eventTitle: string;
  eventDescription: string;
  eventTimeDuration: number;
  eventTimeStartsAt: string;
  isEventOnline: boolean;
  eventZoomAddress: null | string;
  eventPlaceLongitude: null | number;
  eventPlaceLatitude: null | number;
  eventAttachment: string;
  participantImage: string[];
}

export default FixedEvent;
export const UserFixedEvents;
