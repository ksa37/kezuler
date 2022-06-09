import React from 'react';
import { Avatar, Button } from '@mui/material';

import {
  ACCESS_TOKEN_KEY,
  CURRENT_USER_INFO_KEY,
  REFRESH_TOKEN_KEY,
} from 'src/constants/Auth';
import PathName from 'src/constants/PathName';
import { User } from 'src/types/user';
import { deleteCookie } from 'src/utils/cookie';

import MyPageRow from './MyPageRow';

import { ReactComponent as CalenderIcon } from 'src/assets/icn_calender_yb.svg';
import { ReactComponent as ClockIcon } from 'src/assets/icn_clock_yb.svg';
import { ReactComponent as EditIcon } from 'src/assets/icn_edit.svg';
import { ReactComponent as LogoutIcon } from 'src/assets/icn_logout_yb.svg';
import { ReactComponent as PaperIcon } from 'src/assets/icn_paper_yb.svg';
import { ReactComponent as QuestionIcon } from 'src/assets/icn_question_yb.svg';
import 'src/styles/myPage.scss';

interface Props {
  currentUser: User;
  goToEdit: () => void;
}

function MyPageMain({
  currentUser: { userProfileImage, userName },
  goToEdit,
}: Props) {
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

  return (
    <>
      <div className={'my-page-profile'}>
        <Avatar
          className={'my-page-profile-avatar'}
          src={userProfileImage}
          alt={userName}
        />
        <div className={'my-page-profile-main'}>
          <div>{userName}</div>
          {/*<div></div>*/}
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
      </MyPageRow>
      <MyPageRow title={'타임존 설정'} startIcon={<ClockIcon />}>
        kst
      </MyPageRow>
      <h1 className={'my-page-h1'}>서비스 이용</h1>
      <MyPageRow
        onClick={handleQuestionClick}
        title={'이용문의'}
        startIcon={<QuestionIcon />}
      />
      <MyPageRow
        onClick={handleTermsClick}
        title={'이용 약관'}
        startIcon={<PaperIcon />}
      />
      <MyPageRow
        onClick={handlePolicyClick}
        title={'개인정보 보호 정책'}
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
