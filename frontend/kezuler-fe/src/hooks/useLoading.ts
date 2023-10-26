import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { loadingAction } from 'src/reducers/loading';
import { AppDispatch } from 'src/store';

const useLoading = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { setLoading } = loadingAction;

  const startLoading = useCallback(() => {
    dispatch(setLoading(true));
  }, [dispatch]);

  const endLoading = useCallback(() => {
    dispatch(setLoading(false));
  }, [dispatch]);

  return { startLoading, endLoading };
};

export default useLoading;
