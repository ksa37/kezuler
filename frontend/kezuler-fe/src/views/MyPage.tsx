import React, { useState } from 'react';

// import { usePostPendingEvent2 } from 'src/hooks/usePendingEvent';
import MyPageAppBar from 'src/components/common/MyPageAppBar';
import MyPageEdit from 'src/components/my-page/MyPageEdit';
import MyPageMain from 'src/components/my-page/MyPageMain';

import 'src/styles/myPage.scss';

import { getCalendars } from 'src/api/calendar';

function MyPage() {
  const [isEdit, setIsEdit] = useState(false);
  const goToEdit = () => {
    setIsEdit(true);
  };
  const goToMain = () => {
    setIsEdit(false);
  };

  // getCalendars().then((res) => {
  //   console.log(res.data.result);
  // });

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
