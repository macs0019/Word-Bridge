import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Confetti from 'react-confetti';
import './App.css';
import Bar from './bar/Bar';
import useWindowSize from './hooks/useWindowSize';
import Line from './line/Line';
import { startPulseAnimation, startShakeAnimation, stopPulseAnimation } from './services/animationService';
import { changeDate } from './services/dateService';
import { changeLanguage } from './services/languageService';
import { getWordFromSeed } from './services/randomWords';
import { similarity } from './services/similarityService';
import WordContainer from './wordContainer/WordContainer';
import VictoryScreen from './victoryScreen/victoryScreen';

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


  function ajustarMinHeight(ref) {
    // Verifica si el ref y su propiedad current están definidos
    if (ref && ref.current) {
      const alturaViewport = window.innerHeight;
      const alturaVhEnPixeles = (16 * alturaViewport) / 100; // Calcula el 12% de la altura del viewport
      const nuevaAltura = window.innerHeight - alturaVhEnPixeles; // Nueva altura restando el 12vh

      // Ajusta la propiedad minHeight del elemento referenciado
      ref.current.style.minHeight = `${nuevaAltura}px !important`;
    }
  }

  const checkAnswer = (word) => {
    similarity(words[0], word, language).then((result) => {
      if (result !== undefined) {
        if (result > 0.090) {
          similarity(end, word, language).then((result) => {
            if (result > 0.15) {
              //setWords([word, ...words]);
              ajustarMinHeight(centerContainerRef)
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
        <div ref={centerContainerRef} className='center-container' id={"center-container"}>
          {gameOver && <VictoryScreen></VictoryScreen>}
          <div id={"scroll-container"} className='scroll-container'>

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
