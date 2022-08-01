import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PathName from 'src/constants/PathName';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';

import BottomButton from 'src/components/common/BottomButton';
import BottomPopper from 'src/components/common/BottomPopper';

import CelebrateIcon from 'src/assets/image/celebrate.png';
import CelebrateSmileIcon from 'src/assets/image/celebrate-emoji.png';
import BottomCalendarBg from 'src/assets/img_bottom_popper_calendar.svg';
interface Props {
  boldTextFirst: string;
  boldTextSecond: string;
  regularTextFirst: string;
  regularTextSecond: string;
}

function CompletionPage({
  boldTextFirst,
  boldTextSecond,
  regularTextFirst,
  regularTextSecond,
}: Props) {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate(PathName.mainFixed);
  };

  const handleConnectClick = () => {
    //TODO 캘린더 연동
    if (getCurrentUserInfo()?.userGoogleCalendarId !== '') {
      console.log('calendar pair connect needed!');
      //TODO 캘린더 연동
    }
  };

  const [popupOpened, setPopupOpened] = useState(true);

  const handleClosePopper = () => {
    setPopupOpened(false);
  };

  // TODO 캘린더 연동 체크
  const isCalenderConnected = false;

  return (
    <div className={'acceptance-completion'}>
      <div className={'accept-description-text'}>
        {boldTextFirst}
        <br />
        {boldTextSecond}
      </div>
      <div className={'acceptance-completion-sub-description'}>
        {regularTextFirst}
        <br />
        {regularTextSecond}
      </div>
      <div className={'acceptance-completion-bottom-area'}>
        {/* <a
          href={
            'https://www.google.com/calendar/render?action=TEMPLATE&amp;text=수유 랜선투어&amp;dates=20220729T160000%2F20220729T170000&amp;sf=1&amp;output=xml'
          }
        /> */}
        {!isCalenderConnected && (
          <BottomPopper
            title={'케줄러 100% 활용하기'}
            description={'캘린더를 연동하여 이중약속을 방지해요!'}
            buttonText={'구글캘린더 연동하기'}
            onClick={handleConnectClick}
            onDisableClick={handleClosePopper}
            image={BottomCalendarBg}
            notFixed
          />
        )}
        <BottomButton onClick={handleHomeClick} text={'홈으로 가기'} notFixed />
      </div>
      {!popupOpened && (
        <>
          <img
            src={CelebrateSmileIcon}
            className={'celebrate-smile-icon-confirm'}
            alt={''}
          />
          <img
            src={CelebrateIcon}
            className={'celebrate-icon-confirm'}
            alt={''}
          />
        </>
      )}
    </div>
  );
}

export default CompletionPage;
