import { useState, useEffect } from 'react';

const useWindowSize = (centerContainerRef) => {
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setDeviceWidth(window.innerWidth);
      const heightVh = window.innerHeight * 0.06; // Calcula 6% de la altura de la ventana gráfica
      const newHeight = window.innerHeight - heightVh * 2; // Resta el 6% de la altura de la ventana gráfica
      const newHeightPx = newHeight + "px";
      if (deviceWidth <= 1800 && centerContainerRef.current) {
        centerContainerRef.current.style.minHeight = newHeightPx;
      } else if (centerContainerRef.current) {
        centerContainerRef.current.style.minHeight = '90vh';
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [deviceWidth, centerContainerRef]);

  return deviceWidth;
};

export default useWindowSize;