import { DeclinedUser, EventTimeCandidate } from 'src/types/pendingEvent';
import { User } from 'src/types/user';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';

const getAllPossibleUsers = (eventTimeCandidates: EventTimeCandidate[]) => {
  const possibleUsersAll = eventTimeCandidates.reduce<User[]>(
    (prev, eventTimeCandidate) => {
      const userIds = eventTimeCandidate.possibleUsers.map((u) => u);
      return prev.concat(userIds.filter((id) => prev.indexOf(id) < 0));
    },
    []
  );
  return possibleUsersAll;
};
//선택 이력이 있는지 확인
const isModification = (
  eventTimeCandidates: EventTimeCandidate[],
  declinedUsers: DeclinedUser[]
) => {
  const possibleUsersAll = eventTimeCandidates.reduce<string[]>(
    (prev, eventTimeCandidate) => {
      const userIds = eventTimeCandidate.possibleUsers.map((u) => u.userId);
      return prev.concat(userIds.filter((id) => prev.indexOf(id) < 0));
    },
    []
  );

  const declinedUsersAll = declinedUsers.map(
    (declinedUser) => declinedUser.userId
  );

  const currentUserId = getCurrentUserInfo()?.userId;

  return (
    !!currentUserId &&
    (possibleUsersAll.includes(currentUserId) ||
      declinedUsersAll.includes(currentUserId))
  );
};

const getSelectedOptions = (eventTimeCandidates: EventTimeCandidate[]) => {
  const currentUserId = getCurrentUserInfo()?.userId;
  return eventTimeCandidates.reduce<number[]>((prev, eventTimeCandidate) => {
    const included =
      currentUserId &&
      eventTimeCandidate.possibleUsers
        .map((u) => u.userId)
        .includes(currentUserId);
    return included ? prev.concat(eventTimeCandidate.eventStartsAt) : prev;
  }, []);
};

const getDeclineReason = (declinedUsers: DeclinedUser[]) => {
  const currentUser = declinedUsers.filter(
    (declinedUser) => declinedUser.userId === getCurrentUserInfo()?.userId
  );

  if (currentUser.length === 0) {
    return null;
  } else {
    return currentUser[0].userDeclineReason;
  }
};
export {
  isModification,
  getSelectedOptions,
  getDeclineReason,
  getAllPossibleUsers,
};
