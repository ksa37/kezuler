import React, { useEffect, useMemo, useState } from 'react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import Avatar from '@mui/material/Avatar';
import classNames from 'classnames';

import { PROFILE_ACCEPTS } from 'src/constants/MyPage';
import useDialog from 'src/hooks/useDialog';
import useGetUserInfo from 'src/hooks/useGetUserInfo';
import { usePatchUser } from 'src/hooks/usePatchUser';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';

import BottomButton from '../common/BottomButton';

import { ReactComponent as PlusIconYellow } from 'src/assets/btn_plus_y.svg';

interface Props {
  goToMain: () => void;
}

interface UserForm {
  userName: string;
  userEmail: string;
  userProfileImage: File;
}

function MyPageEdit({ goToMain }: Props) {
  const { openDialog } = useDialog();

  const { userName, userEmail, userProfileImage } = useMemo(
    () => ({ ...getCurrentUserInfo() }),
    []
  );
  const { register, handleSubmit, setValue, watch } = useForm<UserForm>();
  const watchProfileImage = watch('userProfileImage');

  const { changeUser } = usePatchUser();
  const { getUserInfo } = useGetUserInfo();

  const [previewImage, setPreviewImage] = useState(userProfileImage);

  const encodeAndPreview = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      if (base64) {
        const encoded = base64 as string;
        setPreviewImage(encoded);
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    encodeAndPreview(watchProfileImage);
  }, [watchProfileImage]);

  const onValid: SubmitHandler<UserForm> = (data) => {
    //TODO
    //email 반영
    changeUser(data, {
      onSuccess: () => {
        getUserInfo({ onFinally: goToMain });
        console.log('success');
        localStorage.setItem('hihi', 'hello');
        // location.reload();
      },
    });
  };
  const onInvalid: SubmitErrorHandler<UserForm> = (error) => {
    console.log(error);
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const splitFile = file.name.split('.');
    const extension = splitFile[splitFile.length - 1]?.toLowerCase();
    if (!PROFILE_ACCEPTS.includes(extension)) {
      openDialog({
        title: `${PROFILE_ACCEPTS.join(
          ', '
        )}\n형태의 파일만 업로드 가능합니다.`,
      });
      return;
    }

    setValue('userProfileImage', file);
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
        className={'my-page-edit-form'}
        onSubmit={handleSubmit(onValid, onInvalid)}
      >
        <div className={'my-page-edit-avatar-wrapper'}>
          <label className={'my-page-profile-label'} htmlFor="profile-upload">
            <input
              className={'my-page-profile-input'}
              onChange={handleProfileImageChange}
              id={'profile-upload'}
              type={'file'}
              accept={PROFILE_ACCEPTS.map((e) => `.${e}`).join(',')}
            />
            <Avatar
              className={'my-page-edit-avatar-img'}
              src={previewImage}
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
        <div className={classNames('my-page-edit-textfield', 'email')}>
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
