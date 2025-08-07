import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Confetti from 'react-confetti';
import './game.css';
import Bar from '../bar/Bar';
import Line from '../line/Line';
import { startShakeAnimation } from '../services/animationService';
import { changeDate } from '../services/dateService';
import { changeLanguage } from '../services/languageService';
import { getWordFromSeed } from '../services/randomWords';
import { saveCompletedLevels } from '../services/saveService';
import { similarity } from '../services/similarityService';
import VictoryScreen from '../victoryScreen/victoryScreen';
import WordContainer from '../wordContainer/WordContainer';
import BarLoader from 'react-spinners/BarLoader';
import { toast } from 'react-toastify'; // Importa toast para mostrar notificaciones
import FavoriteIcon from '@mui/icons-material/Favorite';
import ReplayIcon from '@mui/icons-material/Replay'; // Importa el ícono de reinicio

function Game() {

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
    const [visibleLoader, setVisibleLoader] = useState(false);

    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('language') || 'us';
    });

    const divRef = useRef(null);

    //Ajustar tamaño de la ventana
    const centerContainerRef = useRef(null);
    //useWindowSize(centerContainerRef);

    //Refrescar key de la primera barra
    const [newKey, setNewKey] = useState("")

    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (loading) {
            setVisibleLoader(true);
        }
    }, [loading]);

    const handleAnimationEnd = () => {
        if (!loading) {
            setVisibleLoader(false);
        }
    };

    useEffect(() => {
        changeDate(new Date().toISOString().split('T')[0], language, setEnd, setWords, setStart, getWordFromSeed, setPlayingDate);
    }, [language]);


    useEffect(() => {
        const solutions = getCompletedLevels(playingDate, language);
        if (solutions && solutions.length !== 0) {
            setStart(solutions[0]);
            setEnd(solutions[solutions.length - 1]);
            setInputValue(solutions[solutions.length - 2])
            const reversedSolutions = solutions.slice(0, -1).slice().reverse();
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
    }, [language, playingDate]);

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
        const divElement = document.getElementById("word-input");
        divRef.current = divElement;
        //startPulseAnimation(divRef);
        setInputValue("");
        /*  setSolution([]) */
        setGameOver(false)
    }, [playingDate])

    function reset() {
        setInputValue("");
        setGameOver(false);
        setLostHeartIndex(-1);
        setLives(5);
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


    const checkAnswer = async (word) => {
        const divElement = document.getElementById("word-input");
        divRef.current = divElement;

        const MINIMUM_LOADING_TIME = 1000; // Tiempo mínimo en milisegundos
        const startTime = Date.now(); // Marca el inicio del tiempo

        setLoading(true); // Muestra el spinner

        // Espera a que el spinner esté visible al menos 1 segundo
        await new Promise((resolve) => {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, MINIMUM_LOADING_TIME - elapsedTime);
            setTimeout(() => {
                setLoading(false); // Oculta el spinner
                resolve(); // Continúa con la lógica
            }, remainingTime);
        });

        // Lógica principal después de que el spinner desaparezca
        if (words.includes(word) || word === words[1] || word === end) {
            setInputValue("");
            toast.error("This word has already been used!"); // Muestra el toast
            startShakeAnimation(divRef);
            return;
        }

        const result = await similarity(words[1], word, language);
        if (result !== undefined && result > 0.090) {
            const endResult = await similarity(end, word, language);
            if (endResult > 0.12) {
                setGameOver(true);
                setopenWin(true);
                saveCompletedLevels(playingDate, [...solution, word, end], language);
            } else {
                setWords([word, ...words]);
                setWords((prevWords) => {
                    const newWords = [...prevWords];
                    newWords[1] = word;
                    return newWords;
                });
                setSolution((solution) => [...solution, word]);
                setInputValue("");
                setNewKey(Math.random().toString(16));
            }
        } else {
            loseLife();
            startShakeAnimation(divRef);
        }
    };

    const redo = () => {
        console.log("Playing date:", playingDate);
        changeDate(playingDate, language, setEnd, setWords, setStart, getWordFromSeed, setPlayingDate);
        reset();
        saveCompletedLevels(playingDate, [], language);
    };

    const [lives, setLives] = useState(5); // Número de vidas restantes
    const [lostHeartIndex, setLostHeartIndex] = useState(-1); // Índice del corazón que pierde vida

    const loseLife = () => {
        if (lives > 0) {
            setLostHeartIndex(lostHeartIndex + 1); // Marca el último corazón como perdido
            console.log("Heart lost at index:", lostHeartIndex + 1);
            setTimeout(() => {
                setLives(lives - 1); // Reduce la vida después de la animación
                //setLostHeartIndex(null); // Limpia el índice del corazón perdido
            }, 600); // Duración de la animación (0.6s)
            if (lostHeartIndex + 1>= 4) {
                setGameOver(true); // Si no quedan vidas, termina el juego
                console.log("Game over! No lives left.");
            }


        }
    };

    return (
        <div className="App">
            <header>
                <Bar
                    changeDate={changeDate}
                    openCalendar={openCalendar}
                    setOpenCalendar={setOpenCalendar}
                    language={language}
                    setLanguage={setLanguage}
                    getWordFromSeed={getWordFromSeed}
                    setPlayingDate={setPlayingDate}
                    setEnd={setEnd}
                    setStart={setStart}
                    setWords={setWords}
                    reset={reset}
                    date={playingDate}
                    saveCompletedLevels={saveCompletedLevels}
                ></Bar>
            </header>
            <main>
                <div className="background"></div>
                <div ref={centerContainerRef} className="center-container" id={"center-container"}>
                    {/* Corazones y botón de reinicio */}
                    {!gameOver && <div className="hearts-and-reset">
                        {/* Contenedor para centrar los corazones */}
                        <div className="hearts-container">
                            {[...Array(5)].map((_, index) => (
                                <div
                                    key={index}
                                    className={`heart-icon ${index <= lostHeartIndex ? "heart-lost" : ""
                                        }`}
                                >
                                    {/* Fondo del corazón */}
                                    <FavoriteIcon key={`heart-background-${index}`} className="heart-background" />
                                    {/* Borde del corazón */}
                                    <FavoriteIcon key={`heart-border-${index}`} className="heart-border" />
                                </div>
                            ))}
                        </div>
                        {/* Botón de reinicio posicionado de forma absoluta */}
                        <ReplayIcon onClick={redo} className="reset-icon" style={{ fontSize: '2rem' }} />
                    </div>
                    }

                    {gameOver && (
                        <VictoryScreen
                            reset={reset}
                            end={end}
                            solution={words}
                            getWordFromSeed={getWordFromSeed}
                            language={language}
                            setEnd={setEnd}
                            setPlayingDate={setPlayingDate}
                            setStart={setStart}
                            setWords={setWords}
                            changeDate={changeDate}
                            date={playingDate}
                            setOpenCalendar={setOpenCalendar}
                            victory={lostHeartIndex + 1 <= 4}
                        ></VictoryScreen>
                    )}
                    <div id={"scroll-container"} className="scroll-container">
                        <WordContainer canWritte={false} inputValue={end} index={words.length + 2}></WordContainer>

                        {gameOver && lostHeartIndex + 1 <= 4 && (
                            <Line
                                code={`line-${"A"}`}
                                key={`line-${"A"}`}
                                newKey={newKey + 1}
                            ></Line>
                        )}

                        {words.map((word, index) => (
                            <>
                                {index === 0 ? (
                                    <>
                                        <div
                                            key={word}
                                            id="word-input"
                                            className="writing-container-animated input-div"
                                        >
                                            <div className="input-div overflow-hidden">
                                                <WordContainer
                                                    index={-1}
                                                    canWritte={!gameOver}
                                                    checkAnswer={checkAnswer}
                                                    inputValue={(lives) <= 0 ? "" : inputValue}
                                                    setInputValue={setInputValue}
                                                ></WordContainer>

                                                <div
                                                    className={`spinner-container ${!loading ? "fade-out" : ""}`}
                                                    onAnimationEnd={handleAnimationEnd}
                                                >
                                                    <BarLoader
                                                        color="#333"
                                                        width="99%"
                                                        height={4}
                                                        speedMultiplier={1}
                                                        loading={visibleLoader}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <Line
                                            code={`line-${"A"}`}
                                            key={`line-${"A"}`}
                                            newKey={newKey + 1}
                                        ></Line>
                                    </>
                                ) : (
                                    <div
                                        key={word}
                                        className={(word !== words[1]) && gameOver ? "item" : "fadeIn"}
                                    >
                                        <WordContainer
                                            id={word}
                                            key={index}
                                            inputValue={word}
                                            canWritte={false}
                                            index={index}
                                        ></WordContainer>
                                    </div>
                                )}
                                {words.length !== 2 &&
                                    index !== words.length - 1 &&
                                    index !== 0 && (
                                        <Line
                                            code={`line-${index}`}
                                            key={`line-${index}`}
                                            newKey={newKey}
                                        />
                                    )}
                            </>
                        ))}
                    </div>
                </div>

                {openWin && (
                    <Confetti
                        key={confettiKey}
                        width={window.innerWidth}
                        height={window.innerHeight}
                        tweenDuration={4000}
                        recycle={false}
                    />
                )}
            </main>
        </div>
    );
}

export default Game;
