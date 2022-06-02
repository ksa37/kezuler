import React, { ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField } from '@mui/material';

// import { usePostPendingEvent } from 'src/hooks/usePendingEvent';
import { RootState } from 'src/reducers';
import { createMeetingActions } from 'src/reducers/CreateMeeting';
import { AppDispatch } from 'src/store';

// import { PendingEvent } from 'src/types/pendingEvent';
import BottomButton from 'src/components/common/BottomButton';

function OnOffInfoForm() {
  const onlineTextDescription = '줌 링크 혹은 다른 화상회의 링크를 넣어주세요';
  const offlineTextDescription = '장소 이름 혹은 지도 링크를 넣어주세요';

  const dispatch = useDispatch<AppDispatch>();
  const { increaseStep, setZoomAddress, setPlace } = createMeetingActions;

  const {
    isOnline,

    eventZoomAddress,
    eventPlace,
  } = useSelector((state: RootState) => state.createMeeting);

  // const postPendingEvent = usePostPendingEvent();

  // const handlePostClick = () => {
  //   const pendingEvent: PendingEvent = {
  //     userId,
  //     eventId,
  //     eventHostId,
  //     eventTitle,
  //     eventDescription,
  //     eventTimeDuration,
  //     declinedUsers,
  //     eventTimeCandidates,
  //     eventZoomAddress,
  //     eventPlace,
  //     eventAttachment,
  //   };
  //   postPendingEvent(pendingEvent);
  // };

  const handleOnlineChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setZoomAddress(event.target.value));
  };

  const handleOfflineChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setPlace(event.target.value));
  };

  const handleNextClick = () => {
    dispatch(increaseStep());
  };

  return (
    <>
      {isOnline ? (
        <div>
          <h1>온라인 링크</h1>
          <TextField
            id="standard-basic"
            label={onlineTextDescription}
            variant="standard"
            value={eventZoomAddress}
            onChange={handleOnlineChange}
          />
        </div>
      ) : (
        <div>
          <h1>오프라인 주소</h1>
          <TextField
            id="standard-basic"
            label={offlineTextDescription}
            variant="standard"
            value={eventPlace}
            onChange={handleOfflineChange}
          />
        </div>
      )}
      <BottomButton onClick={handleNextClick} text="다음" />
    </>
  );
}

export default OnOffInfoForm;
