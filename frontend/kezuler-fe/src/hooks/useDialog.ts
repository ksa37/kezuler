import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { dialogAction } from 'src/reducers/dialog';
import { notiAction } from 'src/reducers/noti';
import { DialogProps } from 'src/types/Dialog';

const useDialog = () => {
  const { show } = dialogAction;
  const dispatch = useDispatch();

  const openDialog = useCallback(
    (props: DialogProps) => {
      dispatch(show(props));
    },
    [dispatch, show]
  );

  return { openDialog };
};

const useNoti = () => {
  const { show } = notiAction;
  const dispatch = useDispatch();

  const openNoti = useCallback(
    (props: DialogProps) => {
      dispatch(show(props));
    },
    [dispatch, show]
  );

  return { openNoti };
};

export default useDialog;
export { useNoti };
