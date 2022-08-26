import React, { useState } from 'react';

import MyPageAppBar from 'src/components/common/MyPageAppBar';
import MyPageEdit from 'src/components/my-page/MyPageEdit';
import MyPageMain from 'src/components/my-page/MyPageMain';

import 'src/styles/myPage.scss';

// import { getError, getTest } from 'src/api/mockApi';

function MyPage() {
  const [isEdit, setIsEdit] = useState(false);
  const goToEdit = () => {
    setIsEdit(true);
  };
  const goToMain = () => {
    setIsEdit(false);
  };

  // getTest();
  // getError();

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
