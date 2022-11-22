import { useEffect } from 'react';

export const useSmoothTopScroll = (pathname = '') => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [pathname]);
};
