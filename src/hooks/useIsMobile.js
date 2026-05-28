import { useEffect, useState } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 560px)').matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 560px)');

    function updateIsMobile() {
      setIsMobile(mediaQuery.matches);
    }

    updateIsMobile();
    mediaQuery.addEventListener('change', updateIsMobile);

    return () => {
      mediaQuery.removeEventListener('change', updateIsMobile);
    };
  }, []);

  return isMobile;
}
