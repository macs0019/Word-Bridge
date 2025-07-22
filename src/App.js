import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Confetti from 'react-confetti';
import './App.css';
import Bar from './bar/Bar';
import Line from './line/Line';
import { startPulseAnimation, startShakeAnimation, stopPulseAnimation } from './services/animationService';
import { changeDate } from './services/dateService';
import { changeLanguage } from './services/languageService';
import { getWordFromSeed } from './services/randomWords';
import { saveCompletedLevels } from './services/saveService';
import { similarity } from './services/similarityService';
import VictoryScreen from './victoryScreen/victoryScreen';
import WordContainer from './wordContainer/WordContainer';

function App() {

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [openWin, setopenWin] = useState(false);
  const [playingDate, setPlayingDate] = useState("");
  const [words, setWords] = useState([]);
  const [confettiKey, setConfettiKey] = useState(0); // Una clave para forzar el remontaje
  const [openCalendar, setOpenCalendar] = useState(false);
  const [solution, setSolution] = useState([start])

  const [language, setLanguage] = useState("us");

  const divRef = useRef(null);

  //Ajustar tamaño de la ventana
  const centerContainerRef = useRef(null);
  //useWindowSize(centerContainerRef);

  //Refrescar key de la primera barra
  const [newKey, setNewKey] = useState("")

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    changeDate(new Date().toISOString().split('T')[0], language, setEnd, setWords, setStart, getWordFromSeed, setPlayingDate);
    //localStorage.removeItem("completedLevels")
  }, []);


  useEffect(() => {
    const solutions = getCompletedLevels(playingDate, language);
    if (solutions && solutions.length !== 0) {
      setStart(solutions[0]);
      setEnd(solutions[solutions.length - 1]);
      setInputValue(solutions[solutions.length - 2])
      const reversedSolutions = solutions.slice(0, -2).slice().reverse();
      setWords(reversedSolutions);
      setGameOver(true);
    }
  }, [playingDate, language]);

  useEffect(() => {
    localStorage.setItem('language', language);
    const solutions = getCompletedLevels(playingDate, language);
    if (!solutions || solutions.length === 0) {
      setGameOver(false)
      changeLanguage(language, playingDate, getWordFromSeed, setStart, setEnd, setWords);
      setInputValue("");
    }
  }, [language]);

  useEffect(() => {
    setSolution([start]);
  }, [start]);


  useEffect(() => {
    if (gameOver) {
      // Cambia la clave cada vez que gameOver se convierte en true
      setConfettiKey(prevKey => prevKey + 1);
    }
  }, [gameOver]);


  useLayoutEffect(() => {
    //const divElement = document.getElementById("writting-container");
    //divRef.current = divElement;
    //startPulseAnimation(divRef);
    setInputValue("");
    /*  setSolution([]) */
    setGameOver(false)
  }, [playingDate])

  function reset() {
    setInputValue("");
    setGameOver(false);
    /* setSolution([]) */
  }

  function getCompletedLevels(date, language) {
    // Obtener el string almacenado del Local Storage
    const storedArrayString = localStorage.getItem('completedLevels');

    // Verificar si existe algún dato almacenado
    if (storedArrayString) {
      // Convertir el string de vuelta a un objeto
      const completedLevels = JSON.parse(storedArrayString);


      // Verificar si la fecha especificada y el idioma existen en el objeto
      if (completedLevels.hasOwnProperty(date) && completedLevels[date].hasOwnProperty(language)) {
        return completedLevels[date][language];
      }
    }

    // Devolver un array vacío si la fecha no está presente, el idioma no está presente,
    // o no hay datos almacenados
    return [];
  }


  const checkAnswer = (word) => {
    if (words.includes(word) || word === words[1] || word === end) {
      //stopPulseAnimation(divRef);
      setInputValue("");
      //startShakeAnimation(divRef); // Assuming you meant startShakeAnimation here
      return;
    }
    console.log("Checking answer for word:", word);
    similarity(words[1], word, language).then((result) => {
      if (result !== undefined) {
        if (result > 0.090) {
          similarity(end, word, language).then((result) => {
            if (result > 0.15) {
              setGameOver(true);
              setopenWin(true);
              saveCompletedLevels(playingDate, [...solution, word, end], language)
              //stopPulseAnimation(divRef);
            } else {
              setWords([word, ...words]);
              setWords((prevWords) => {
                const newWords = [...prevWords]; // Crea una copia del array
                newWords[1] = word; // Cambia el valor en la posición 1
                return newWords; // Devuelve el array modificado
              });
              setSolution(solution => [...solution, word]);
              setInputValue("");
              setNewKey(Math.random().toString(16));
            }
          })
        } else {
          //stopPulseAnimation(divRef);
          //startShakeAnimation(divRef);
        }
      } else {
        //startShakeAnimation(divRef);
      }

    })
  }

  return (
    <div className="App">
      <header>
        <Bar changeDate={changeDate} openCalendar={openCalendar} setOpenCalendar={setOpenCalendar} language={language} setLanguage={setLanguage} getWordFromSeed={getWordFromSeed} setPlayingDate={setPlayingDate} setEnd={setEnd} setStart={setStart} setWords={setWords}></Bar>
      </header>
      <main>
        <div className='background'></div>
        <div ref={centerContainerRef} className='center-container' id={"center-container"}>
          {gameOver && <VictoryScreen reset={reset} getWordFromSeed={getWordFromSeed} language={language} setEnd={setEnd} setPlayingDate={setPlayingDate} setStart={setStart} setWords={setWords} changeDate={changeDate} date={playingDate} setOpenCalendar={setOpenCalendar}></VictoryScreen>}
          <div id={"scroll-container"} className='scroll-container'>

            <WordContainer canWritte={false} inputValue={end} index={words.length + 2}></WordContainer>

            {gameOver && <Line Line
              code={`line-${"A"}`}
              key={`line-${"A"}`}
              newKey={newKey + 1}></Line>}

            {words.map((word, index) => (
              <>
                {index === 0 ? (
                  // Si es el primer WordContainer (posición 0), renderiza el input editable
                  <>
                    <div key={word} className="writing-container-animated">
                      <WordContainer
                        index={-1}
                        canWritte={!gameOver}
                        checkAnswer={checkAnswer}
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                      ></WordContainer>
                    </div>

                    {gameOver && <Line Line
                      code={`line-${"B"}`}
                      key={`line-${"B"}`}
                      newKey={newKey + 1}></Line>}
                  </>
                ) : (

                  // Si no es el primer WordContainer, renderiza el resto normalmente
                  <div key={word} className={(word !== words[0]) && gameOver ? "item" : "fadeIn"}>
                    <WordContainer
                      id={word}
                      key={index}
                      inputValue={word}
                      canWritte={false}
                      index={index}
                    ></WordContainer>
                  </div>
                )}
                {/* Renderiza las líneas entre los WordContainer */}
                {words.length !== 2 && index !== words.length - 1 && index != 0 && (
                  <Line
                    code={`line-${index}`}
                    key={`line-${index}`}
                    newKey={newKey}
                  />
                )}
              </>
            ))}
          </div >
        </div >

        {openWin &&
          <Confetti
            key={confettiKey}
            width={window.innerWidth}
            height={window.innerHeight}
            tweenDuration={4000}
            recycle={false}
          />}
      </main>
    </div>
  );
}

export default App;
