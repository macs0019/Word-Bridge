import ReplayIcon from '@mui/icons-material/Replay';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import TwitterIcon from '@mui/icons-material/Twitter';
import { getDescription } from '../services/languageService';
import './victoryScreen.css';
import { saveCompletedLevels } from '../services/saveService';
import { dateToLevelNumber } from '../services/dateService';

const VictoryScreen = ({ victory = true, setOpenCalendar, changeDate, date, language, setEnd, setWords, setStart, getWordFromSeed, setPlayingDate, reset, solution, end }) => {
    const redo = () => {
        changeDate(date, language, setEnd, setWords, setStart, getWordFromSeed, setPlayingDate);
        reset();
        saveCompletedLevels(date, [], language);
    };

    const shareOnTwitter = () => {
        const maxTweetLength = 280; // Límite de caracteres en Twitter
        const baseMessage = `I completed the level ${dateToLevelNumber(date)} in ${solution.length - 1} words on WordBridge!\n\n`;

        // Formatea las palabras en una sola línea con flechitas entre ellas
        const formattedWords = [end, ...solution]
            .slice()
            .reverse() // Ordena las palabras en orden ascendente
            .join(' → '); // Usa flechitas para separar las palabras

        let tweet = `${baseMessage}${formattedWords}`;

        // Si el tweet supera el límite, recorta las palabras centrales
        if (tweet.length > maxTweetLength) {
            const half = Math.floor(solution.length / 2);
            const truncatedWords = [
                ...solution.slice(0, half - 1),
                '...',
                ...solution.slice(half + 1),
                end, // Asegúrate de incluir "end" al final
            ]
                .reverse()
                .join(' → '); // Usa flechitas para separar las palabras truncadas
            tweet = `${baseMessage}${truncatedWords}`;
        }

        // Codifica la URL para Twitter
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
        window.open(twitterUrl, '_blank'); // Abre la URL en una nueva pestaña
    };

    return (
        <>
            <div className="victory-screen">
                {victory ? (
                    <>
                        <p>{getDescription(language, 0)}</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '5%' }}>
                            <ReplayIcon onClick={() => redo()} className="icon"></ReplayIcon>
                            <EventRepeatIcon onClick={() => setOpenCalendar(true)} className="icon"></EventRepeatIcon>
                            <TwitterIcon onClick={shareOnTwitter} className="icon"></TwitterIcon>
                        </div>
                    </>
                ) : (
                    <>
                        <p>Better luck next time! Try again to complete the level.</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '5%' }}>
                            <ReplayIcon onClick={() => redo()} className="icon"></ReplayIcon>
                            <EventRepeatIcon onClick={() => setOpenCalendar(true)} className="icon"></EventRepeatIcon>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default VictoryScreen;