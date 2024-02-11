import ReplayIcon from '@mui/icons-material/Replay';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import TwitterIcon from '@mui/icons-material/Twitter';
import './victoryScreen.css'

const VictoryScreen = () => {

    return (<>
        <div className='victory-screen'>
            <p>¡Has ganado!</p>
            <div style={{ display: 'flex', justifyContent:'center', gap: "5%" }}>
                <ReplayIcon></ReplayIcon>
                <EventRepeatIcon></EventRepeatIcon>
                <TwitterIcon></TwitterIcon>
            </div>
        </div>
    </>)

}

export default VictoryScreen;