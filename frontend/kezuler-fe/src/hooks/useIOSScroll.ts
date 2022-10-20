import { useEffect, useMemo } from 'react';
import { isIOS, isMobile } from 'react-device-detect';

const useIOSScroll = () => {
  const defaultHeightDiff = useMemo(() => {
    return window.outerHeight - window.innerHeight;
  }, []);

  useEffect(() => {
    if (!isMobile || !isIOS) {
      return;
    }

    const app = document.getElementById('App');
    const appInner = document.getElementById('app-inner');

    if (appInner && app) {
      const handler = () => {
        if (window.outerHeight - window.innerHeight > defaultHeightDiff) {
          app.style.height = '100vh';
        } else {
          app.style.height = 'calc(var(--vh, 1vh) * 100)';
        }
      };

      const observer = new ResizeObserver((entries) => {
        entries.forEach((e) => {
          if (window.outerHeight - e.contentRect.height > defaultHeightDiff) {
            app.style.height = '100vh';
          } else {
            app.style.height = 'calc(var(--vh, 1vh) * 100)';
          }
        });
        handler();
      });

      observer.observe(appInner);

      return () => {
        observer.unobserve(appInner);
      };
    }
  }, []);
};

export default useIOSScroll;
