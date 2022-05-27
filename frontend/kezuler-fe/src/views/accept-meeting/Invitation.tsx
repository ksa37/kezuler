import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Avatar,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';

import { AcceptMeetingSteps } from 'src/constants/Steps';
import { RootState } from 'src/reducers';
import { acceptMeetingActions } from 'src/reducers/AcceptMeeting';
import { AppDispatch } from 'src/store';

import BlackButton from 'src/components/common/BlackButton';
import ProgressBar from 'src/components/ProgressBar';

function Invitation() {
  const dispatch = useDispatch<AppDispatch>();
  const { pendingEvent } = useSelector(
    (state: RootState) => state.acceptMeeting
  );
  const {
    eventId,
    eventTitle,
    eventDescription,
    eventTimeDuration,
    declinedUsers,
    eventTimeCandidates,
    eventZoomAddress,
    eventPlace,
    eventAttachment,
  } = pendingEvent;
  const { increaseStep, decreaseStep } = acceptMeetingActions;

  const handleNextClick = () => {
    dispatch(increaseStep());
  };

  const inviteDescription = '님이 미팅에 초대합니다.';
  //TODO: 정보 가져오기
  const hostName = '서혜민';
  const meetingTitleDescription = '미팅 제목';
  const meetingPlaceDescription = '미팅 장소';
  const timeSelectDescription = '참여 가능한 시간을 알려주세요';

  return (
    <>
      <div>
        <div>
          <h2>
            <Avatar alt="" src="" />
            {hostName + inviteDescription}
          </h2>
        </div>
        <Box
          sx={{
            flexGrow: 1,
            maxWidth: 752,
            backgroundColor: 'lightgrey',
          }}
        >
          <Grid item xs={12} md={6}>
            <div>
              <List>
                <ListItem>
                  <ListItemText
                    primary={meetingTitleDescription}
                    secondary={eventTitle}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={meetingPlaceDescription}
                    secondary={eventZoomAddress || eventPlace}
                  />
                </ListItem>
              </List>
            </div>
          </Grid>
        </Box>
      </div>
      <div>
        <h2>{timeSelectDescription}</h2>
        <Button onClick={handleNextClick}>카카오로 계속하기</Button>
      </div>
      {/* <BlackButton text={'다음'} onClick={handleNextClick} /> */}
    </>
  );
}

export default Invitation;
