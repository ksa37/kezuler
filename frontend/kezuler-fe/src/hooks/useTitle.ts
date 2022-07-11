import { useEffect } from 'react';

const useTitle = (newVal: string) => {
  useEffect(() => {
    const htmlTitle = document.querySelector('title');
    if (htmlTitle) {
      htmlTitle.innerHTML = newVal;
    }
  }, []);
};

export default useTitle;
