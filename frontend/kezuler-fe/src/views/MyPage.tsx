import React, { useEffect, useMemo, useState } from 'react';

import { SettingUser } from 'src/types/user';
import getCurrentUserInfo from 'src/utils/getCurrentUserInfo';

import MyPageAppBar from 'src/components/common/MyPageAppBar';
import MyPageEdit from 'src/components/my-page/MyPageEdit';
import MyPageMain from 'src/components/my-page/MyPageMain';

import 'src/styles/myPage.scss';

function MyPage() {
  const [isEdit, setIsEdit] = useState(false);
  const goToEdit = () => {
    setIsEdit(true);
  };
  const goToMain = () => {
    setIsEdit(false);
  };

  const [currentUser, setCurrentUser] = useState<SettingUser | null>(
    getCurrentUserInfo()
  );
  useEffect(() => {
    console.log('re');
    const handler = () => {
      console.log('htnkjndsk');
      setCurrentUser(getCurrentUserInfo());
    };
    window.addEventListener('storage', handler);

    return () => window.removeEventListener('storage', handler);
  }, []);

  // const currentUser = useMemo(() => getCurrentUserInfo(), []);

  return (
    <>
      <MyPageAppBar isEdit={isEdit} goToMain={goToMain} />
      <div className={'my-page'}>
        {currentUser &&
          (isEdit ? (
            <MyPageEdit currentUser={currentUser} goToMain={goToMain} />
          ) : (
            <MyPageMain currentUser={currentUser} goToEdit={goToEdit} />
          ))}
      </div>
    </>
  );
}

export default MyPage;
