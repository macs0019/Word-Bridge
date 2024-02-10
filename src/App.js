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
import { getSpanishWordFromSeed, getChineseWordFromSeed, getFrenchWordFromSeed, getGermanWordFromSeed, getItalianWordFromSeed } from './services/randomWords';
import Confetti from 'react-confetti'
import useWindowSize from './hooks/useWindowSize';
import { changeDate } from './services/dateService';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%) !important',
  width: '40vw',
  bgcolor: '#f3f3f3',
  boxShadow: 24,
  border: 'none',
  outline: 'none',
  p: 4,
  maxHeight: '70vh',
  background: "rgba(255, 255, 255, 0.8)",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(5px)",
  webkitBackdropFilter: "blur(5px)",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
  borderRadius: '20px',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column'
};

function App() {

  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const newSeed = `${year}${month}${day}`;


  const [start, setStart] = useState(generate({ min: 1, max: 1, seed: (newSeed).toString() })[0]);
  const [end, setEnd] = useState(generate({ min: 1, max: 1, seed: (newSeed + 1).toString() })[0]);
  const [words, setWords] = useState([start]);
  const [gameOver, setGameOver] = useState(false);
  const [actualWord, setActualWord] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [openWin, setopenWin] = useState(false);
  const [playingDate, setPlayingDate] = useState("");
  const handleopenWin = () => setopenWin(true);
  const handleCloseHelp = () => setopenWin(false);
  const [confettiKey, setConfettiKey] = useState(0); // Una clave para forzar el remontaje

  const [renderedWords, setRenderedWords] = useState(new Set());
  const [language, setLanguage] = useState("us");

  //Ajustar tamaño de la ventana
  const centerContainerRef = useRef(null);
  useWindowSize(centerContainerRef);

  //Refrescar key de la primera barra
  const [newKey, setNewKey] = useState("")

  useEffect(() => {
    changeLanguage(language);
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

  const divRef = useRef(null);
  const InputPropsRef = useRef(null);

  useLayoutEffect(() => {
    const divElement = document.getElementById("writting-container");
    divRef.current = divElement;
    startPulseAnimation();
    setInputValue("");
    setGameOver(false)
  }, [playingDate])

  function startShakeAnimation() {
    divRef.current.classList.add("shake-animation");
    divRef.current?.addEventListener("animationend", () => {
      stopShakeAnimation();
      startPulseAnimation();
    });
  }
  //Pulse animation
  const startPulseAnimation = () => {
    if (divRef.current) {
      divRef.current.classList.add("pulse-animation");
    }
  };

  const stopPulseAnimation = () => {
    if (divRef.current) {
      divRef.current.classList.remove("pulse-animation");
    }
  };

  function changeLanguage(language) {
    let dt = "";
    if (playingDate !== "") {
      dt = new Date(playingDate);
    } else {
      dt = new Date();
    }
    const daySeed = dt.getDate();
    const monthSeed = dt.getMonth() + 1;
    const yearSeed = dt.getFullYear();
    const seed = `${yearSeed}${monthSeed}${daySeed}`;

    switch (language) {
      case "es":
        setEnd(getSpanishWordFromSeed((seed + 1).toString()));
        const newSpanishStart = getSpanishWordFromSeed((seed).toString());
        console.log("Inicio: " + newSpanishStart)
        setStart(newSpanishStart);
        setWords([newSpanishStart]);
        break;
      case "cn":
        setEnd(getChineseWordFromSeed((seed + 1).toString()));
        const newChineseStart = getChineseWordFromSeed((seed).toString());
        console.log("Inicio: " + newChineseStart)
        setStart(newChineseStart);
        setWords([newChineseStart]);
        break;
      case "de":
        setEnd(getGermanWordFromSeed((seed + 1).toString()));
        const newGermanStart = getGermanWordFromSeed((seed).toString());
        console.log("Inicio: " + newGermanStart)
        setStart(newGermanStart);
        setWords([newGermanStart]);
        break;
      case "fr":
        setEnd(getFrenchWordFromSeed((seed + 1).toString()));
        const newFrenchStart = getFrenchWordFromSeed((seed).toString());
        console.log("Inicio: " + newFrenchStart)
        setStart(newFrenchStart);
        setWords([newFrenchStart]);
        break;
      case "it":
        setEnd(getItalianWordFromSeed((seed + 1).toString()));
        const newItalianStart = getItalianWordFromSeed((seed).toString());
        console.log("Inicio: " + newItalianStart)
        setStart(newItalianStart);
        setWords([newItalianStart]);
        break;
      case "us":
        setEnd(generate({ min: 1, max: 1, seed: (seed + 1).toString() })[0]);
        const newStart = generate({ min: 1, max: 1, seed: (seed).toString() })[0];
        setStart(newStart);
        setWords([newStart]);
        break;
      default:
        break;
    }
  }


  function stopShakeAnimation() {
    divRef.current.removeEventListener("animationend", stopShakeAnimation);
    divRef.current.classList.remove("shake-animation");
  }

  const checkAnswer = (word) => {
    console.log(words.toString())
    similarity(words[0], word, language).then((result) => {
      if (result !== undefined) {
        if (result > 0.090) {
          similarity(end, word, language).then((result) => {
            if (result > 0.15) {
              //setWords([word, ...words]);
              setGameOver(true);
              setopenWin(true);
              stopPulseAnimation();
            } else {
              setWords([word, ...words]);
              setInputValue("");
              setNewKey(Math.random().toString(16));
            }
          })

        } else {
          stopPulseAnimation();
          startShakeAnimation();
        }
      } else {
        startShakeAnimation();
      }

    })
  }

  return (
    <div className="App">
      <header>
        <Bar changeDate={changeDate} language={language} setLanguage={setLanguage} setPlayingDate={setPlayingDate} getSpanishWordFromSeed={getSpanishWordFromSeed} setEnd={setEnd} setStart={setStart} setWords={setWords}></Bar>
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
              <WordContainer index={-1} canWritte={!gameOver} word={actualWord} checkAnswer={checkAnswer} inputValue={inputValue} setInputValue={setInputValue}></WordContainer>
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
