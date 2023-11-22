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
import generateDateList from './services/dateService';

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
  const handleopenWin = () => setopenWin(true);
  const handleCloseHelp = () => setopenWin(false);

  const [renderedWords, setRenderedWords] = useState(new Set());

  const centerContainerRef = useRef(null);

  // Estado para almacenar el ancho del dispositivo
  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);

  // Función para ajustar la altura
  const setHeight = () => {
    const heightVh = window.innerHeight * 0.06; // Calcula 6% de la altura de la ventana gráfica
    const newHeight = window.innerHeight - heightVh*2; // Resta el 6% de la altura de la ventana gráfica
    const newHeightPx = newHeight + "px";
    if (centerContainerRef.current) centerContainerRef.current.style.minHeight = newHeightPx;
  };

  // Usar useEffect para añadir el event listener y para la lógica inicial
  useEffect(() => {
    const handleResize = () => {
      setDeviceWidth(window.innerWidth);
      if (deviceWidth <= 1920) {
        setHeight();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Para establecer la altura inicial

    // Limpieza del event listener
    return () => window.removeEventListener('resize', handleResize);
  }, [deviceWidth]);

  useEffect(() => {
    const newRenderedWords = new Set([...renderedWords, ...words]);
    setRenderedWords(newRenderedWords);
  }, [words]);

  const divRef = useRef(null);
  const InputPropsRef = useRef(null);

  useLayoutEffect(() => {
    const divElement = document.getElementById("writting-container");
    divRef.current = divElement;
  }, [])

  function startShakeAnimation() {
    divRef.current.classList.add("shake-animation");
    divRef.current?.addEventListener("animationend", () => {
      stopShakeAnimation();
    });
  }

  function changeDate(date) {
    const dt = new Date(date);
    const daySeed = dt.getDate();
    const monthSeed = dt.getMonth() + 1;
    const yearSeed = dt.getFullYear();
    const seed = `${yearSeed}${monthSeed}${daySeed}`;
    setEnd(generate({ min: 1, max: 1, seed: (seed + 1).toString() })[0]);
    const newStart = generate({ min: 1, max: 1, seed: (seed).toString() })[0];
    setStart(newStart);
    setWords([newStart]);
    setGameOver(false);
  }


  function stopShakeAnimation() {
    divRef.current.removeEventListener("animationend", stopShakeAnimation);
    divRef.current.classList.remove("shake-animation");
  }



  const checkAnswer = (word) => {
    similarity(words[0], word).then((result) => {
      if (result > 0.090) {
        setWords([word, ...words]);
        setInputValue("");
        similarity(end, word).then((result) => {
          if (result > 0.15) {
            setWords([word, ...words]);
            setGameOver(true);
            setopenWin(true);
          }

        })
      } else {
        startShakeAnimation();
      }

    })
  }

  return (
    <div className="App">
      <header>
        <Bar changeDate={changeDate}></Bar>
      </header>
      <main>
        <div className='background'></div>
        <div className='center-container' id={"center-container"}>
          <div ref={centerContainerRef} id={"scroll-container"} className='scroll-container'>
            <WordContainer canWritte={false} inputValue={end} index={words.length + 2}></WordContainer>
            {gameOver && <Line ></Line>}
            {!gameOver &&
              <div id="writting-container" className=''>
                <WordContainer index={-1} canWritte={true} word={actualWord} checkAnswer={checkAnswer} inputValue={inputValue} setInputValue={setInputValue}></WordContainer>
              </div>
            }

            {words.map((word, index) => (
              <>
                <div key={word} className={word !== words[0] ? "item" : "fadeIn"}>
                  <WordContainer id={word} key={index} inputValue={word} canWritte={false} index={index}></WordContainer>
                </div>
                {words.length !== 1 && index !== words.length - 1 && <Line key={index}></Line>}
              </>
            ))}
          </div>
        </div>
        <Modal
          open={openWin}
          onClose={handleCloseHelp}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{
            '.MuiPaper-root': {
              border: 'none !important',
              boxShadow: 'none !important',
              outline: 'none !important',

            }
          }}
        >
          <Grow in={openWin} timeout={300}>
            <Box className={"box-container"}>
              <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bold', color: '#333', textAlign: 'center' }}>
                🎉 You won! 🎉
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2, textAlign: 'justify', fontWeight: 'bold', color: '#333' }}>
                Congratulations! 🎉 You've successfully completed this level using only {words.length - 1} words to bridge the start and the end. Your skill in weaving connections between words showcases your sharp wit and language mastery.
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2, textAlign: 'justify', fontWeight: 'bold', color: '#333' }}>

                But the fun doesn't stop here. We invite you to explore and challenge yourself with levels from previous days. Each one offers a unique set of words and challenges you to find new and creative paths through the vast world of vocabulary. Ready for more linguistic adventures? Dive into previous levels and see how far your ingenuity can take you! 🌉📚🚀
              </Typography>
            </Box>
          </Grow>
        </Modal>
      </main>
    </div>
  );
}

export default App;
