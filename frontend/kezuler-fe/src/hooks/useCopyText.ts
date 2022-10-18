import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { alertAction } from 'src/reducers/alert';

const useCopyText = () => {
  const { show, hide } = alertAction;
  const dispatch = useDispatch();

  const copyText = useCallback(
    (targetText: string, targetName: string) => {
      if (navigator.clipboard !== undefined) {
        navigator.clipboard
          .writeText(targetText)
          .then(() => {
            dispatch(show({ title: `${targetName} 복사되었습니다.` }));
          })
          .catch(() => {
            dispatch(show({ title: '복사를 실패하였습니다.' }));
          });
        // .finally(() => {
        //   setTimeout(() => {
        //     dispatch(hide());
        //   }, 1500);
        // });
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = targetText;
        document.body.appendChild(textArea);
        textArea.select();
        textArea.setSelectionRange(0, 99999);
        try {
          document.execCommand('copy');
        } catch (err) {
          dispatch(show({ title: '복사를 실패하였습니다.' }));
        }
        textArea.setSelectionRange(0, 0);
        document.body.removeChild(textArea);
        dispatch(show({ title: `${targetName} 복사되었습니다.` }));
      }
    },
    [dispatch, show]
  );

  return { copyText };
};

export default useCopyText;
