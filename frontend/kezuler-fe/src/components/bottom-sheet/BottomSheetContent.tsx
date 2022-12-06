import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar } from '@mui/material';

interface Props {
  currentUserId?: string;
  comments: {
    _id: string;
    eventID: string;
    userId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  }[];
  event?: PendingEvent | BFixedEvent;
}

import { BFixedEvent } from 'src/types/fixedEvent';
import { PendingEvent } from 'src/types/pendingEvent';
import { User } from 'src/types/user';
import { isFixedEvent } from 'src/utils/typeGuard';

import 'src/styles/Storage.scss';
function BottomSheetContent({ currentUserId, comments, event }: Props) {
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  });
  const eventParticipants = useMemo(() => {
    if (event) {
      const hostInfo = { ...event.eventHost };
      if (isFixedEvent(event)) {
        const guestInfo = event.participants;
        return [hostInfo, ...guestInfo];
      } else {
        const participantsArray: User[] = [];
        event.eventTimeCandidates.forEach(({ possibleUsers }) => {
          possibleUsers.forEach((el) => {
            participantsArray.push(el);
          });
        });
        return [
          hostInfo,
          ...participantsArray.reduce<User[]>(function (acc, current) {
            if (
              acc.findIndex(({ userId }) => userId === current.userId) === -1
            ) {
              acc.push(current);
            }
            return acc;
          }, []),
          ...event.declinedUsers,
        ];
      }
    }
  }, [event]);
  console.log(eventParticipants);

  const findUser = (userId: string) => {
    return eventParticipants?.filter((el) => el.userId === userId)[0];
  };

  return (
    <div
      id={'comments-wrapper'}
      ref={scrollRef}
      className="bottom-sheet-content"
    >
      {comments?.map((el: any) => {
        if (el.userId === currentUserId)
          return (
            <div key={el._id} className="bottom-sheet-content-host">
              <div className="bottom-sheet-content-host-content">
                {el.content}
              </div>
            </div>
          );
        else
          return (
            <div key={el._id} className="bottom-sheet-content-guest">
              <div className="bottom-sheet-content-guest-profile">
                <Avatar
                  className={'bottom-sheet-content-avatar '}
                  alt={findUser(el.userId)?.userName}
                  src={findUser(el.userId)?.userProfileImage}
                />
                <div className="bottom-sheet-content-avatar-name">
                  {findUser(el.userId)?.userName}
                </div>
              </div>
              <div className="bottom-sheet-content-guest-content">
                {el.content}
              </div>
            </div>
          );
      })}
    </div>
  );
}

export default BottomSheetContent;
