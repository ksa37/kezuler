interface PendingEvent {
  eventId: string;
  eventTitle: string;
  eventDescription: string;
  eventTimeDuration: number;
  eventTimeCandidates: Array;
  isEventOnline: boolean;
  eventZoomAddress: null | string;
  eventPlaceLongitude: number;
  eventPlaceLatitude: number;
  eventAttachment: string;
}

// interface EventTimeCandidate {

// }

export default PendingEvent;

// {
//   "userId": "user0001",
//   "pendingEvents": [
//     {
//       "eventId": "pendingevt01",
//       "eventTitle": "17학번 회식",
//       "eventDescription": "...",
//       "eventTimeDuration": 60,
//       "eventTimeCandidates": [
//         {
//           "2022-04-11": [
//             {
//               "eventStartsAt": "08:00",
//               "possbileUsers": [
//                 {
//                   "userId": "user0002",
//                   "userImage": "..."
//                 },
//                 {
//                   "userId": "user0003",
//                   "userImage": "..."
//                 }
//               ]
//             },
//             {
//               "eventStartsAt": "13:00",
//               "possbileUsers": [
//                 {
//                   "userId": "user0002",
//                   "userImage": "..."
//                 }
//               ]
//             },
//             {
//               "eventStartsAt": "19:00",
//               "possbileUsers": []
//             }
//           ]
//         }
//       ],
//       "isEventOnline": false,
//       "eventZoomAddress": null,
//       "eventPlaceLongitude": 126.9835766,
//       "eventPlaceLatitude": 37.5707075
//     },
