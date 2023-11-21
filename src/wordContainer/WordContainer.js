import './WordContainer.css'
import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';

const WordContainer = ({ canWritte, word, checkAnswer, inputValue, setInputValue, index }) => {


    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            checkAnswer(inputValue);
        }
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    return (
        <TextField
            className='word-box'
            hiddenLabel
            value={inputValue}
            variant="filled"
            size="small"
            InputProps={{ readOnly: !canWritte }}
            onKeyPress={handleKeyPress}
            onChange={handleInputChange}
        />
    )
}

export default WordContainer;