import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';

import PathName from 'src/constants/PathName';
import { createMeetingActions } from 'src/reducers/CreateMeeting';

import { ReactComponent as EventIcon } from 'src/assets/icn_add_event.svg';
import { ReactComponent as PlusIcon } from 'src/assets/icn_plus.svg';
import { ReactComponent as VoteIcon } from 'src/assets/icn_vote.svg';

function MainButtonContainer() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { setFixedCreate } = createMeetingActions;
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleVoteClick = () => navigate(PathName.create);
  const handleEventClick = () =>
    navigate(PathName.createInfo, { state: { fixed: true } });

  const actions = [
    { icon: <VoteIcon />, name: '일정조율', onClick: handleVoteClick },
    { icon: <EventIcon />, name: '일정추가', onClick: handleEventClick },
  ];

  return (
    <div className={'main-floating-button-container'}>
      <Box
        sx={{
          height: '100vh',
          transform: 'translateZ(0px)',
          flexGrow: 1,
          pointerEvents: 'none',
        }}
      >
        <Backdrop open={open} sx={{ pointerEvents: 'none' }} />
        <SpeedDial
          ariaLabel="Create Event Dial"
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          classes={{ fab: 'main-floating-button-dial' }}
          icon={<SpeedDialIcon />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              // classes={{ avatar: 'fixed-event-card-avatar-num' }}
              classes={{ fab: 'main-floating-button-action' }}
              // className={'main-floating-button'}
              icon={action.icon}
              tooltipTitle={action.name}
              tooltipOpen
              // tooltipPlacement="left-start"
              onClick={action.onClick}
            />
          ))}
        </SpeedDial>
      </Box>

      {/* <NavLink className={'main-floating-button'} to={PathName.create}>
        <div className={'main-floating-button-icon'}>
          <PlusIcon />
        </div>
        <div className={'main-floating-button-text'}>{'미팅생성'}</div>
      </NavLink> */}
    </div>
  );
}

export default MainButtonContainer;
