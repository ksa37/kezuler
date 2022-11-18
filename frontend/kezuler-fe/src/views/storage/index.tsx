import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

import PathName from 'src/constants/PathName';
import { mainFixedActions } from 'src/reducers/mainFixed';
import { mainPendingActions } from 'src/reducers/mainPending';
import { AppDispatch } from 'src/store';

import TextAppBar from 'src/components/common/TextAppBar';
import StorageAddBtn from 'src/components/storage/StorageAddBtn';

import 'src/styles/Storage.scss';

function StoragePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { destroy: fixedDestroy } = mainFixedActions;
  const { destroy: pendingDestroy } = mainPendingActions;
  const navigate = useNavigate();

  // 페이지 나갈 때 redux 스토어 초기화
  // useEffect(() => {
  //   return () => {
  //     dispatch(fixedDestroy());
  //     dispatch(pendingDestroy());
  //   };
  // }, []);

  window.onpopstate = function () {
    const prevUrl = document.referrer;
    //뒤로가기를 한 페이지가 미팅일정선택완료 페이지면 메인페이지(fixed)로 이동.
    if (prevUrl.indexOf('/invite') >= 0 && prevUrl.indexOf('/complete') >= 0) {
      navigate(PathName.mainFixed);
    }
  };
  const handlePrevClick = () => {
    navigate(-1);
  };
  return (
    <div>
      <div>
        <TextAppBar onClick={handlePrevClick} text="보관함" />
        <div className="folder-wrapper">
          <StorageAddBtn />
        </div>
      </div>
    </div>
  );
}

export default StoragePage;
