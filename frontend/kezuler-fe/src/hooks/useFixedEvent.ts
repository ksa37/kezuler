import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import PathName from 'src/constants/PathName';
import { alertAction } from 'src/reducers/alert';
import { AppDispatch } from 'src/store';
import { PPostFixedEvent } from 'src/types/fixedEvent';

import { postFixedEvent } from 'src/api/fixedEvent';

const usePostFixedEvent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { show } = alertAction;

  const postFixedEventByConfirm = (
    pfixedEvent: PPostFixedEvent,
    eventId: string
  ) => {
    postFixedEvent(pfixedEvent)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log('미팅 확정 에러', err);
        dispatch(
          show({
            title: '미팅 확정 오류',
            description: '미팅 확정 과정 중 오류가 생겼습니다.',
          })
        );
        navigate(`${PathName.confirm}:/${eventId}`, { replace: true });
      });
  };
  return postFixedEventByConfirm;
};

// const useDeleteFixedEvent = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { show } = alertAction;

//   const deleteFixedEvent = (eventId: string) => {
//     deleteFixedEventHostById(eventId)
//       .then((res) => {
//         console.log(res);
//       })
//       .catch((err) => {
//         console.log('미팅 삭제 에러', err);
//         dispatch(
//           show({
//             title: '미팅 삭제 오류',
//             description: '미팅 삭제 과정 중 오류가 생겼습니다.',
//           })
//         );
//       });
//   };

//   return deleteFixedEvent;
// };

// const useCancelFixedEvent = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { show } = alertAction;

//   const cancelFixedEvent = (eventId: string) => {
//     cancelFixedEventHostById(eventId)
//       .then((res) => {
//         console.log(res);
//       })
//       .catch((err) => {
//         console.log('미팅 취소 에러', err);
//         dispatch(
//           show({
//             title: '미팅 취소 오류',
//             description: '미팅 취소 과정 중 오류가 생겼습니다.',
//           })
//         );
//       });
//   };

//   return cancelFixedEvent;
// };

// const useDeleteFixedEventGuest = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { show } = alertAction;

//   const deleteFixedEvent = (eventId: string) => {
//     deleteFixedEventGuestById(eventId)
//       .then((res) => {
//         console.log(res);
//       })
//       .catch((err) => {
//         console.log('미팅 삭제 에러', err);
//         dispatch(
//           show({
//             title: '미팅 삭제 오류',
//             description: '미팅 삭제 과정 중 오류가 생겼습니다.',
//           })
//         );
//       });
//   };

//   return deleteFixedEvent;
// };

// const useCancelFixedEventGuest = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { show } = alertAction;

//   const cancelFixedEvent = (eventId: string) => {
//     cancelFixedEventGuestById(eventId)
//       .then((res) => {
//         console.log(res);
//       })
//       .catch((err) => {
//         console.log('미팅 취소 에러', err);
//         dispatch(
//           show({
//             title: '미팅 취소 오류',
//             description: '미팅 취소 과정 중 오류가 생겼습니다.',
//           })
//         );
//       });
//   };

//   return cancelFixedEvent;
// };

export {
  usePostFixedEvent,
  // useDeleteFixedEvent,
  // useCancelFixedEvent,
  // useCancelFixedEventGuest,
  // useDeleteFixedEventGuest,
};
