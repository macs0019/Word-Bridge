import './Bar.css'
import HelpIcon from '@mui/icons-material/Help';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Height } from '@mui/icons-material';
import { Grow } from '@mui/material';
import generateDateList from '../services/dateService';
import { useEffect } from 'react';
import { Grid } from '@mui/material';

const Bar = ({ changeDate }) => {

    const [openHelp, setOpenHelp] = useState(false);
    const handleOpenHelp = () => setOpenHelp(true);
    const handleCloseHelp = () => setOpenHelp(false);

    const [openCalendar, setOpenCalendar] = useState(false);
    const handleOpenCalendar = () => setOpenCalendar(true);
    const handleCloseCalendar = () => setOpenCalendar(false);

    const [dateList, setDateList] = useState([]);

    const changeDay = (date) => {
        changeDate(date);
        handleCloseCalendar(true);
    }

    useEffect(() => {
        if (openCalendar) {
            const endDate = new Date();
            endDate.setDate(new Date().getDate() + 50);
            const endDateFormat = endDate.toISOString().split('T')[0];

            const list = generateDateList(endDateFormat);
            setDateList(list);
        }
    }, [openCalendar]);

    return (
        <>
            <div className="bar-container">
                <HelpOutlineIcon onClick={handleOpenHelp} className='icon' />
                <h2>Word Bridge</h2>
                <CalendarMonthIcon onClick={handleOpenCalendar} className='icon' />
            </div>
            <Modal
                open={openHelp}
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
                <Grow in={openHelp} timeout={300}>
                    <Box className={"box-container"}>
                            <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bold', color: '#333' }}>
                                🎮 How to play 🎮
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2, textAlign: 'justify', fontWeight: 'bold', color: '#333' }}>
                                Welcome to "Word Bridge" 🎮, a unique word association challenge! The game displays two words: one at the bottom (⬇️) and another at the top (⬆️) of your screen. Your exciting task 🧠 is to connect these words by building a bridge of related words, moving from the bottom ⬇️ to the top ⬆️.

                                Imagine the bottom word is "moon" 🌙 and the top word is "tide" 🌊. You might link them like "moon 🌙 → gravity 🛸 → ocean 🌊 → tide 🌊." Starting from the lower word, each connection in your chain should logically lead upwards ⬆️ to your destination word at the top.

                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2, textAlign: 'justify', fontWeight: 'bold', color: '#333' }}>

                                This game 🎲 tests your vocabulary and creative thinking skills, challenging you to think outside the box 📦 and make clever connections. As you progress through levels, the puzzle becomes more intricate and thought-provoking, offering endless fun and mental stimulation.

                                "Word Bridge" 🌉 is perfect for puzzle enthusiasts, word game lovers, and anyone who enjoys a good brain teaser. Get ready to explore the amazing world of words and climb your way to the top! 🏆
                            </Typography>
                    </Box>
                </Grow>
            </Modal>
            <Modal
                open={openCalendar}
                onClose={handleCloseCalendar}
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
                <Grow in={openCalendar} timeout={300}>
                    <Box className={"box-container"}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bold', color: '#333', textAlign: 'center' }}>
                            📈 Levels history 📈
                        </Typography>
                        <Grid container spacing={2} className='tiles-container'>
                            {dateList.map((date, index) => (
                                <Grid item xs={'auto'} key={index} className={"calendar-grid"}>
                                    <Box onClick={() => changeDay(date)} className={"tiles"}
                                    >
                                        {dateList.length - (index)}
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Grow>
            </Modal>
        </>
    )
}

export default Bar;