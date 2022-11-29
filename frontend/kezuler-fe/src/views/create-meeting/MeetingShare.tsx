import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import PathName from 'src/constants/PathName';
import { RootState } from 'src/reducers';
import { historyStorageActions } from 'src/reducers/HistoryStorage';
import { AppDispatch } from 'src/store';

import BottomButton from 'src/components/common/BottomButton';
import BottomCard from 'src/components/common/BottomCard';
import ShareIcons from 'src/components/common/ShareIcons';

import CelebrateIcon from 'src/assets/image/celebrate.png';
import CelebrateSmileIcon from 'src/assets/image/celebrate-emoji.png';

function MeetingShare() {
  const dispatch = useDispatch<AppDispatch>();
  const { eventTitle, eventId, fixedCreate } = useSelector(
    (state: RootState) => state.createMeeting
  );
  const { setPrevUrl, setEventTitle } = historyStorageActions;

  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate(PathName.mainPending);
  };

  const handleStorageClick = () => {
    dispatch(setEventTitle(eventTitle));
    dispatch(setPrevUrl(location.pathname));
    navigate(`${PathName.storage}/${eventId}`);
  };

  return (
    <div className={'create-wrapper'}>
      <div className={'padding-wrapper'}>
        <div className={'description-text'}>
          {'새로운 미팅 일정이'}
          <br />
          {'완성되었습니다!'}
        </div>
        <div className={'sub-description-text'}>
          {'케줄러링크를 통해'}
          <br />
          {'사람들을 미팅에 초대하세요!'}
        </div>
        <ShareIcons eventTitle={eventTitle} eventId={eventId} />
        {!fixedCreate && (
          <>
            <img
              src={CelebrateSmileIcon}
              className={'celebrate-smile-icon'}
              alt={''}
            />
            <img src={CelebrateIcon} className={'celebrate-icon'} alt={''} />
          </>
        )}
        {/* {fixedCreate && (
          <BottomCard
            descriptions={[
              {
                text: '잠깐! 케줄러는 일정에 참여하는 사람들에게 \n 손쉽게 공유할 수 있는 ',
                highlight: false,
                break: true,
              },
              {
                text: '자료 보관함',
                highlight: true,
              },
              {
                text: '이 있어요!',
                highlight: false,
              },
            ]}
            buttons={[
              { title: '자료 업로드하기', onClick: handleStorageClick },
            ]}
          />
        )} */}
      </div>
      <BottomButton onClick={handleHomeClick} text="홈으로 가기" />
    </div>
  );
}

export default MeetingShare;
