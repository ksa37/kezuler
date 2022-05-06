interface FixedEvent {
  eventId: string;
  eventTitle: string;
  eventDescription: string;
  eventTimeDuration: number;
  eventTimeStartsAt: string;
  isEventOnline: boolean;
  eventZoomAddress: null | string;
  eventPlaceLongitude: number;
  eventPlaceLatitude: number;
  eventAttachment: string;
  participantImage: Array<string>;
}

export default FixedEvent;
