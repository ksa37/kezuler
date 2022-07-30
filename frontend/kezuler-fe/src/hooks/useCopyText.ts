import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { alertAction } from 'src/reducers/alert';

const useCopyText = () => {
  const { show, hide } = alertAction;
  const dispatch = useDispatch();

  const copyText = useCallback(
    (targetText: string, targetName: string) => {
      navigator.clipboard
        .writeText(targetText)
        .then(() => {
          dispatch(show({ title: `${targetName} 복사되었습니다.` }));
        })
        .catch(() => {
          dispatch(show({ title: '복사를 실패하였습니다.' }));
        })
        .finally(() => {
          setTimeout(() => {
            dispatch(hide());
          }, 1500);
        });
    },
    [dispatch, show]
  );

  return { copyText };
};

export default useCopyText;
