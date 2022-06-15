import React, { ChangeEvent, useState } from 'react';
import { Avatar } from '@mui/material';

import { usePatchUserById } from 'src/hooks/userUser';
import { User } from 'src/types/user';

import BottomButton from '../common/BottomButton';

import { ReactComponent as PlusIconYellow } from 'src/assets/btn_plus_y.svg';

interface Props {
  currentUser: User;
  goToMain: () => void;
}

function MyPageEdit({ currentUser, goToMain }: Props) {
  const [editUserName, setEditUserName] = useState(currentUser.userName);
  // const [editUserEMail, setEditUserEMail] = useState(currentUser.userEmail);
  const [editUserEmail, setEditUserEmail] = useState('일단 넣음');

  const handleUserProfileImageChange = () => {
    //TODO
    console.log('change profile image');
  };
  const handleUserNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditUserName(event.target.value);
  };
  const handleUserEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditUserEmail(event.target.value);
  };

  const changeUserById = usePatchUserById();
  const handleUserInfoChange = () => {
    //TODO
    //email 반영
    changeUserById(currentUser.userId, {
      userName: editUserName,
      userProfileImage: currentUser.userProfileImage,
    });
    goToMain();
  };

  return (
    <div className={'my-page-edit'}>
      <div className={'my-page-edit-avatar-wrapper'}>
        <div
          className={'my-page-edit-avatar'}
          onClick={handleUserProfileImageChange}
        >
          <Avatar
            className={'my-page-edit-avatar-img'}
            src={currentUser.userProfileImage}
            alt={currentUser.userName}
          />
          <PlusIconYellow className={'my-page-edit-avatar-plus-icn'} />
        </div>
      </div>
      <div className={'my-page-edit-textfield'}>
        <div className={'my-page-edit-textfield-title'}>이름</div>
        <input
          type="text"
          id="userName"
          required
          className={'my-page-edit-textfield-box'}
          placeholder={'이름을 입력해주세요.'}
          value={editUserName}
          maxLength={7}
          onChange={handleUserNameChange}
        />
      </div>
      <div className={'my-page-edit-textfield'}>
        <div className={'my-page-edit-textfield-title'}>이메일</div>
        <input
          type="text"
          id="userEmail"
          required
          className={'my-page-edit-textfield-box'}
          placeholder={'이메일을 입력해주세요.'}
          value={editUserEmail}
          maxLength={7}
          onChange={handleUserEmailChange}
        />
      </div>
      <BottomButton onClick={handleUserInfoChange} text={'저장하기'} />
    </div>
  );
}

export default MyPageEdit;
