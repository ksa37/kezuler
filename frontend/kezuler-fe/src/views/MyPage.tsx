import React, { useEffect, useMemo, useState } from 'react';

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

  return (
    <>
      <MyPageAppBar isEdit={isEdit} goToMain={goToMain} />
      <div className={'my-page'}>
        {isEdit ? (
          <MyPageEdit goToMain={goToMain} />
        ) : (
          <MyPageMain goToEdit={goToEdit} />
        )}
      </div>
    </>
  );
}

export default MyPage;
