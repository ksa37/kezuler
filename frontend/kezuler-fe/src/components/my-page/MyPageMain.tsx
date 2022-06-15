import React, { useState } from 'react';
import { Avatar, Button } from '@mui/material';

import {
  ACCESS_TOKEN_KEY,
  CURRENT_USER_INFO_KEY,
  REFRESH_TOKEN_KEY,
} from 'src/constants/Auth';
import { MEETING_LENGTH_LIST } from 'src/constants/CreateMeeting';
import PathName from 'src/constants/PathName';
import { User } from 'src/types/user';
import { deleteCookie } from 'src/utils/cookie';

import MyPageRow from './MyPageRow';
import KezulerDropdown from 'src/components/common/KezulerDropdown';

import { ReactComponent as CalenderIcon } from 'src/assets/icn_calender_yb.svg';
import { ReactComponent as ClockIcon } from 'src/assets/icn_clock_yb.svg';
import { ReactComponent as ArrowDownIcon } from 'src/assets/icn_dn_outline.svg';
import { ReactComponent as EditIcon } from 'src/assets/icn_edit.svg';
import { ReactComponent as LogoutIcon } from 'src/assets/icn_logout_yb.svg';
import { ReactComponent as PaperIcon } from 'src/assets/icn_paper_yb.svg';
import { ReactComponent as QuestionIcon } from 'src/assets/icn_question_yb.svg';
import { ReactComponent as ToggleOffIcon } from 'src/assets/toggle_off.svg';
import { ReactComponent as ToggleOnIcon } from 'src/assets/toggle_on.svg';
import 'src/styles/myPage.scss';

interface Props {
  currentUser: User;
  goToEdit: () => void;
}

function MyPageMain({
  currentUser: { userProfileImage, userName },
  goToEdit,
}: Props) {
  //TODO email 가져오기

  const userEmail = 'example@example.com';

  const handleQuestionClick = () => {
    console.log('hi');
  };

  const handleTermsClick = () => {
    console.log('hi');
  };

  const handlePolicyClick = () => {
    console.log('hi');
  };

  const handleLogoutClick = () => {
    deleteCookie(ACCESS_TOKEN_KEY);
    deleteCookie(REFRESH_TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_INFO_KEY);
  };

  const handleEditClick = () => {
    goToEdit();
  };

  const handleCalendarToggle = () => {
    setIsCalendarPaired(true);
  };

  //TODO 구글 캘린더 연동
  const [isCalendarPaired, setIsCalendarPaired] = useState(false);

  const [selectedLengthIdx, setSelectedLengthIdx] = useState(1);

  return (
    <>
      <div className={'my-page-profile'}>
        <Avatar
          className={'my-page-profile-avatar'}
          src={userProfileImage}
          alt={userName}
        />
        <div className={'my-page-profile-main'}>
          <div className={'my-page-profile-name'}>{userName}</div>
          <div className={'my-page-profile-email'}>{userEmail}</div>
        </div>
        <Button
          onClick={handleEditClick}
          className={'my-page-profile-edit-btn'}
          startIcon={<EditIcon />}
        >
          편집하기
        </Button>
      </div>
      <h1 className={'my-page-h1'}>미팅 정보</h1>
      <MyPageRow title={'캘린더 연동'} startIcon={<CalenderIcon />}>
        구글캘린더
        {isCalendarPaired ? (
          <ToggleOnIcon className={'calendar-toggle'} />
        ) : (
          <ToggleOffIcon
            className={'calendar-toggle'}
            onClick={handleCalendarToggle}
          />
        )}
      </MyPageRow>
      <MyPageRow title={'타임존 설정'} startIcon={<ClockIcon />}>
        <KezulerDropdown
          buttonClassName={'timezone-dropdown'}
          menuData={MEETING_LENGTH_LIST}
          displayKey={'display'}
          selectedIdx={selectedLengthIdx}
          setSelectedIdx={setSelectedLengthIdx}
          endIcon={<ArrowDownIcon />}
        />
      </MyPageRow>
      <h1 className={'my-page-h1'}>서비스 이용</h1>
      <MyPageRow
        onClick={handleQuestionClick}
        title={'이용문의'}
        href={'https://www.notion.so/5581c32572c94984a93b6f4e0010f32a'}
        startIcon={<QuestionIcon />}
      />
      <MyPageRow
        onClick={handleTermsClick}
        title={'이용약관'}
        href={'https://www.notion.so/4856b0c81b4b48629afd6ab3e8e6132a'}
        startIcon={<PaperIcon />}
      />
      <MyPageRow
        onClick={handlePolicyClick}
        title={'개인정보 보호 정책'}
        href={'https://www.notion.so/b11df8e98a51409e9d7113ac3104169f'}
        startIcon={<PaperIcon />}
      />
      <MyPageRow
        href={PathName.login}
        onClick={handleLogoutClick}
        title={'로그아웃'}
        startIcon={<LogoutIcon />}
      />
    </>
  );
}

export default MyPageMain;
