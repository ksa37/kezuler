import React from 'react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Avatar } from '@mui/material';

import useGetUserInfo from 'src/hooks/useGetUserInfo';
import { usePatchUser } from 'src/hooks/usePatchUser';
import { dialogAction } from 'src/reducers/dialog';
import { AppDispatch } from 'src/store';
import { SettingUser } from 'src/types/user';

import BottomButton from '../common/BottomButton';

import { ReactComponent as PlusIconYellow } from 'src/assets/btn_plus_y.svg';

interface Props {
  currentUser: SettingUser;
  goToMain: () => void;
}

interface UserForm {
  userName: string;
  userEmail: string;
  userProfileImage: string;
}

function MyPageEdit({
  currentUser: { userName, userEmail, userProfileImage },
  goToMain,
}: Props) {
  const { register, handleSubmit, setValue, watch } = useForm<UserForm>();
  const watchProfileImage = watch('userProfileImage', userProfileImage);
  const dispatch = useDispatch<AppDispatch>();
  const { show } = dialogAction;
  const { changeUser } = usePatchUser();
  const { getUserInfo } = useGetUserInfo();

  const onValid: SubmitHandler<UserForm> = (data) => {
    //TODO
    //email 반영
    changeUser(data, {
      onSuccess: () => {
        getUserInfo({ onFinally: goToMain });
      },
    });
  };
  const onInvalid: SubmitErrorHandler<UserForm> = (error) => {
    console.log(error);
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      if (base64) {
        const encoded = base64 as string;
        setValue('userProfileImage', encoded);
      } else {
        dispatch(show({ title: '이미지 변환을 실패했습니다.' }));
      }
      e.target.value = '';
    };
    if (e.target.files?.[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.code === 'Enter') {
      const form = document.forms[0];
      const index = Array.prototype.indexOf.call(form, event.target);
      if (index + 1 < 3) {
        const focusEl: any = form.elements[index + 1];
        focusEl.focus();
      }
      event.preventDefault();
    }
  };

  return (
    <div className={'my-page-edit'}>
      <form
        id={'my-page-edit-form'}
        onSubmit={handleSubmit(onValid, onInvalid)}
      >
        <div className={'my-page-edit-avatar-wrapper'}>
          <label className={'my-page-profile-label'} htmlFor="profile-upload">
            <input
              className={'my-page-profile-input'}
              onChange={handleProfileImageChange}
              id={'profile-upload'}
              type={'file'}
              accept="image/*"
            />
            <Avatar
              className={'my-page-edit-avatar-img'}
              src={watchProfileImage}
              alt={userName}
            />
            <PlusIconYellow className={'my-page-edit-avatar-plus-icn'} />
          </label>
        </div>
        <div className={'my-page-edit-textfield'}>
          <div className={'my-page-edit-textfield-title'}>이름</div>
          <input
            onKeyDown={handleKeyDown}
            className={'my-page-edit-textfield-box'}
            placeholder={'이름을 입력해주세요.'}
            defaultValue={userName}
            {...register('userName', {
              required: true,
            })}
          />
        </div>
        <div className={'my-page-edit-textfield'}>
          <div className={'my-page-edit-textfield-title'}>이메일</div>
          <input
            onKeyDown={handleKeyDown}
            className={'my-page-edit-textfield-box'}
            placeholder={'이메일을 입력해주세요.'}
            defaultValue={userEmail}
            {...register('userEmail', {
              required: true,
            })}
          />
        </div>
        <BottomButton type={'submit'} text={'저장하기'} />
      </form>
    </div>
  );
}

export default MyPageEdit;
