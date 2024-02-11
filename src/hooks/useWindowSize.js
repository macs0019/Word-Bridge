import { useState, useEffect } from 'react';

const useWindowSize = (centerContainerRef) => {
    const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            const alturaViewport = window.innerHeight;
            const alturaVhEnPixeles = (4 * alturaViewport) / 100;
            setDeviceWidth(window.innerWidth);
            const heightVh = window.innerHeight * 0.06; // Calcula 6% de la altura de la ventana gráfica
            const newHeight = window.innerHeight - heightVh * 2; // Resta el 6% de la altura de la ventana gráfica
            const newHeightPx = newHeight + "px";
            if (deviceWidth <= 1800 && centerContainerRef.current) {
                centerContainerRef.current.style.minHeight = newHeightPx;
                centerContainerRef.current.style.maxHeight = newHeightPx;
            } else if (centerContainerRef.current) {

                // Convertir 90vh a píxeles (90% de la altura del viewport)
                const altura90vhEnPixeles = (94 * alturaViewport) / 100;

                // Restar 32px (asegúrate de convertir la altura a un número antes de restar)
                const nuevaAlturaEnPixeles = altura90vhEnPixeles;

                // Actualizar la propiedad minHeight con el nuevo valor en píxeles
                centerContainerRef.current.style.minHeight = `${nuevaAlturaEnPixeles}px`;
                centerContainerRef.current.style.maxHeight = `${nuevaAlturaEnPixeles}px`;
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, [deviceWidth, centerContainerRef]);

    return deviceWidth;
};

export default useWindowSize;