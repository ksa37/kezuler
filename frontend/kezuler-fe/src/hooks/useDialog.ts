import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { dialogAction } from 'src/reducers/dialog';
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

export default useDialog;
