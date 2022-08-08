import React, { useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import classNames from 'classnames';

import { PROFILE_ACCEPTS, PROFILE_MAX_SIZE } from 'src/constants/MyPage';
import {
  INVALID_EMAIL_ERROR,
  MAX_NAME_LENGTH,
  MAX_NAME_LENGTH_ERROR,
  REQUIRED_ERROR,
} from 'src/constants/Validation';
import useGetUserInfo from 'src/hooks/useGetUserInfo';
import { usePatchUser } from 'src/hooks/usePatchUser';
import { alertAction } from 'src/reducers/alert';
import { AppDispatch } from 'src/store';
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
  const dispatch = useDispatch<AppDispatch>();
  const { show } = alertAction;

  const { userName, userEmail, userProfileImage } = useMemo(
    () => ({ ...getCurrentUserInfo() }),
    []
  );
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserForm>({ mode: 'onChange' });
  const watchForm = watch();

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
    encodeAndPreview(watchForm.userProfileImage);
  }, [watchForm.userProfileImage]);

  const onValid: SubmitHandler<UserForm> = (data) => {
    //TODO
    //email 반영
    changeUser(data, {
      onSuccess: () => {
        getUserInfo({ onFinally: goToMain });
      },
    });
  };

  const checkEmail = (target: string) => {
    if (target && !target.match(/^.+@.+\..+$/g)) {
      return INVALID_EMAIL_ERROR;
    }
    return true;
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    // 형식 검사
    const splitFile = file.name.split('.');
    const extension = splitFile[splitFile.length - 1]?.toLowerCase();
    if (!PROFILE_ACCEPTS.includes(extension)) {
      dispatch(
        show({
          title: `${PROFILE_ACCEPTS.join(
            ', '
          )}\n형태의 파일만 업로드 가능합니다.`,
        })
      );
      return;
    }

    // 용량 검사
    if (file.size > PROFILE_MAX_SIZE) {
      dispatch(
        show({
          title: `2MB 이하의 파일만 업로드 가능합니다.`,
        })
      );
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

  const saveButtonDisabled =
    !!errors.userName ||
    !!errors.userEmail ||
    !watchForm.userEmail ||
    !watchForm.userName;

  return (
    <div className={'my-page-edit'}>
      <form
        id={'my-page-edit-form'}
        className={'my-page-edit-form'}
        onSubmit={handleSubmit(onValid)}
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
            className={classNames('my-page-edit-textfield-box', {
              error: errors.userName,
            })}
            placeholder={'이름을 입력해주세요.'}
            defaultValue={userName}
            {...register('userName', {
              required: REQUIRED_ERROR,
              maxLength: {
                value: MAX_NAME_LENGTH,
                message: MAX_NAME_LENGTH_ERROR,
              },
            })}
          />
          {errors.userName && (
            <div className={'my-page-edit-error-text'}>
              {errors.userName.message}
            </div>
          )}
        </div>
        <div className={classNames('my-page-edit-textfield', 'email')}>
          <div className={'my-page-edit-textfield-title'}>이메일</div>
          <input
            onKeyDown={handleKeyDown}
            className={classNames('my-page-edit-textfield-box', {
              error: errors.userEmail,
            })}
            placeholder={'이메일을 입력해주세요.'}
            defaultValue={userEmail}
            {...register('userEmail', {
              required: REQUIRED_ERROR,
              validate: {
                isEmail: checkEmail,
              },
            })}
          />
          {errors.userEmail && (
            <div className={'my-page-edit-error-text'}>
              {errors.userEmail.message}
            </div>
          )}
        </div>
        <div className={'my-page-edit-notice'}>
          <div className={'my-page-edit-notice-title'}>유의사항</div>
          <div className={'my-page-edit-notice-text'}>
            잘못된 이름 또는 이메일 사용시, 서비스 사용에 불편함이 생길 수
            있으니 정확한 정보를 기재해주시길 바랍니다.
          </div>
        </div>
        <BottomButton
          disabled={saveButtonDisabled}
          type={'submit'}
          text={'저장하기'}
        />
      </form>
    </div>
  );
}

export default MyPageEdit;
