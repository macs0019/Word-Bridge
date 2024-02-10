import logo from './logo.svg';
import './App.css';
import Bar from './bar/Bar';
import WordContainer from './wordContainer/WordContainer';
import { generate, count } from "random-words";
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { similarity } from './services/similarityService';
import Line from './line/Line';
import Modal from '@mui/material/Modal';
import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Height } from '@mui/icons-material';
import { Grow } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import Confetti from 'react-confetti'
import useWindowSize from './hooks/useWindowSize';
import { changeDate } from './services/dateService';
import { getWordFromSeed } from './services/randomWords'
import { changeLanguage } from './services/languageService';
import { startShakeAnimation, stopPulseAnimation, stopShakeAnimation, startPulseAnimation } from './services/animationService'

function App() {

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [words, setWords] = useState([start]);
  const [gameOver, setGameOver] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [openWin, setopenWin] = useState(false);
  const [playingDate, setPlayingDate] = useState("");
  const [confettiKey, setConfettiKey] = useState(0); // Una clave para forzar el remontaje

  const [renderedWords, setRenderedWords] = useState(new Set());
  const [language, setLanguage] = useState("us");

  const divRef = useRef(null);

  //Ajustar tamaño de la ventana
  const centerContainerRef = useRef(null);
  useWindowSize(centerContainerRef);

  //Refrescar key de la primera barra
  const [newKey, setNewKey] = useState("")

  useEffect(() => {
    changeLanguage(language, playingDate, getWordFromSeed, setStart, setEnd, setWords);
    setInputValue("");
  }, [language])


  useEffect(() => {
    if (gameOver) {
      // Cambia la clave cada vez que gameOver se convierte en true
      setConfettiKey(prevKey => prevKey + 1);
    }
  }, [gameOver]);


  useEffect(() => {
    const newRenderedWords = new Set([...renderedWords, ...words]);
    setRenderedWords(newRenderedWords);
  }, [words]);


  useLayoutEffect(() => {
    const divElement = document.getElementById("writting-container");
    divRef.current = divElement;
    startPulseAnimation(divRef);
    setInputValue("");
    setGameOver(false)
  }, [playingDate])

  const checkAnswer = (word) => {
    similarity(words[0], word, language).then((result) => {
      if (result !== undefined) {
        if (result > 0.090) {
          similarity(end, word, language).then((result) => {
            if (result > 0.15) {
              //setWords([word, ...words]);
              setGameOver(true);
              setopenWin(true);
              stopPulseAnimation(divRef);
            } else {
              setWords([word, ...words]);
              setInputValue("");
              setNewKey(Math.random().toString(16));
            }
          })
        } else {
          stopPulseAnimation(divRef);
          startShakeAnimation(divRef);
        }
      } else {
        startShakeAnimation(divRef);
      }

    })
  }

  return (
    <div className="App">
      <header>
        <Bar changeDate={changeDate} language={language} setLanguage={setLanguage} getWordFromSeed={getWordFromSeed} setPlayingDate={setPlayingDate} setEnd={setEnd} setStart={setStart} setWords={setWords}></Bar>
      </header>
      <main>
        <div className='background'></div>
        <div className='center-container' id={"center-container"}>
          <div ref={centerContainerRef} id={"scroll-container"} className='scroll-container'>

            <WordContainer canWritte={false} inputValue={end} index={words.length + 2}></WordContainer>

            {gameOver && <Line Line
              code={`line-${"A"}`}
              key={`line-${"A"}`}
              newKey={newKey + 1}></Line>}

            <div id="writting-container" className=''>
              <WordContainer index={-1} canWritte={!gameOver} checkAnswer={checkAnswer} inputValue={inputValue} setInputValue={setInputValue}></WordContainer>
            </div>

            {gameOver && <Line Line
              code={`line-${"B"}`}
              key={`line-${"B"}`}
              newKey={newKey + 1}></Line>}

            {words.map((word, index) => (
              <>
                <div key={word} className={(word !== words[0]) && gameOver ? "item" : "fadeIn"}>
                  <WordContainer id={word} key={index} inputValue={word} canWritte={false} index={index}></WordContainer>
                </div>
                {words.length !== 1 && index !== words.length - 1 && <Line
                  code={`line-${index}`}
                  key={`line-${index}`}
                  newKey={newKey}
                />}
              </>
            ))}
          </div>
        </div>

        {openWin &&
          <Confetti
            key={confettiKey}
            width={window.innerWidth}
            height={window.innerHeight}
            tweenDuration={3000}
            recycle={false}
          />}
      </main>
    </div>
  );
}

export default App;
