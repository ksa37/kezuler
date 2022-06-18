import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'src/reducers';
import { getPendingEventsThunk } from 'src/reducers/mainPending';
import { AppDispatch } from 'src/store';

const useMainPending = () => {
  const { events, isFetched } = useSelector(
    (state: RootState) => state.mainPending
  );
  const dispatch = useDispatch<AppDispatch>();

  const getPendingEvents = useCallback(
    (onFinally?: () => void) =>
      dispatch(getPendingEventsThunk({ onFinally: onFinally })),
    [dispatch]
  );

  return { getPendingEvents, events, isFetched };
};
export default useMainPending;
