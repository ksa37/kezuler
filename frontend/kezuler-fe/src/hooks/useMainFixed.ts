import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'src/reducers';
import { getFixedEventsThunk } from 'src/reducers/mainFixed';
import { AppDispatch } from 'src/store';

const useMainFixed = () => {
  const { events, isFetched } = useSelector(
    (state: RootState) => state.mainFixed
  );
  const dispatch = useDispatch<AppDispatch>();

  const getFixedEvents = useCallback(
    (onFinally?: () => void) => {
      //TODO index 설정
      return dispatch(
        getFixedEventsThunk({
          params: {
            startIndex: '0',
            endIndex: '10',
          },
          onFinally,
        })
      );
    },
    [dispatch]
  );

  return { getFixedEvents, events, isFetched };
};

export default useMainFixed;
