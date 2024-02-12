import ReplayIcon from '@mui/icons-material/Replay';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import TwitterIcon from '@mui/icons-material/Twitter';
import { getDescription } from '../services/languageService';
import './victoryScreen.css'
import { saveCompletedLevels } from '../services/saveService';

const VictoryScreen = ({ setOpenCalendar, changeDate, date, language, setEnd, setWords, setStart, getWordFromSeed, setPlayingDate, reset }) => {

    const redo = () => {
        changeDate(date, language, setEnd, setWords, setStart, getWordFromSeed, setPlayingDate);
        reset();
        saveCompletedLevels(date, [], language)
    }

    return (<>
        <div className='victory-screen'>
            <p>{getDescription(language, 0)}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: "5%" }}>
                <ReplayIcon onClick={() => redo()} className='icon'></ReplayIcon>
                <EventRepeatIcon onClick={() => setOpenCalendar(true)} className='icon'></EventRepeatIcon>
                <TwitterIcon className='icon'></TwitterIcon>
            </div>
        </div>
    </>)

}

export default VictoryScreen;