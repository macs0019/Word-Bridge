import React, { useEffect, useRef } from 'react';
import { TextField } from '@mui/material';
import './WordContainer.css';
import typingSound from '../audio/typing.mp3'; // Importa el archivo de sonido

const WordContainer = ({ canWritte, checkAnswer, inputValue, setInputValue }) => {
    // Crea una referencia al objeto de audio usando el archivo importado
    const audioRef = useRef(new Audio(typingSound));

    useEffect(() => {
        // Pre-carga el audio y establece cómo manejar el final de la reproducción
        const audio = audioRef.current;
        audio.preload = 'auto';
        audio.addEventListener('ended', () => {
            audio.currentTime = 0; // Reinicia el audio cuando termina
        });
        return () => {
            audio.removeEventListener('ended', () => {
                audio.currentTime = 0;
            });
        };
    }, []);

    const playSound = () => {
        const audio = audioRef.current;
        audio.currentTime = 0;
        audio.play().catch(error => console.error("Error playing the sound:", error));

    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            checkAnswer(inputValue);
        } else {
            playSound(); // Reproduce el sonido con cada pulsación de tecla
        }
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    return (
        <>
            <TextField
                className='word-box'
                hiddenLabel
                value={inputValue}
                variant="filled"
                size="small"
                InputProps={{
                    readOnly: !canWritte,
                    inputProps: {
                        autoComplete: 'off',
                    }
                }}
                onKeyPress={handleKeyPress}
                onChange={handleInputChange}
            />
        </>
    );
};

export default WordContainer;