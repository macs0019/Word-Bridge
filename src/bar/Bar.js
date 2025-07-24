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
import { generateDateList } from '../services/dateService';
import { useEffect } from 'react';
import { Grid } from '@mui/material';
import NativeSelect from '@mui/material';
import FormControl from '@mui/material';
import LanguageDropdown from '../dropdown/LenguageDropdown';
import { getWordFromSeed } from '../services/randomWords';
import exampleGif from '../files/example.gif';

const Bar = ({ changeDate, language, setLanguage, setEnd, setWords, setStart, getWordFromSeed, setPlayingDate, openCalendar, setOpenCalendar }) => {

    const [openHelp, setOpenHelp] = useState(false);
    const handleOpenHelp = () => setOpenHelp(true);
    const handleCloseHelp = () => setOpenHelp(false);

    const handleOpenCalendar = () => setOpenCalendar(true);
    const handleCloseCalendar = () => setOpenCalendar(false);

    const [completedLevels, setCompletedLevels] = useState({});

    const [dateList, setDateList] = useState([]);

    const changeDay = (date) => {
        changeDate(date, language, setEnd, setWords, setStart, getWordFromSeed, setPlayingDate);
        console.log(date)
        handleCloseCalendar(true);
    }

    useEffect(() => {
        if (openCalendar) {
            const endDate = new Date();
            endDate.setDate(new Date().getDate());
            //const endDateFormat = endDate.toISOString().split('T')[0];

            const list = generateDateList();
            setDateList(list);
        }
    }, [openCalendar]);

    useEffect(() => {
        const levels = localStorage.getItem('completedLevels');
        setCompletedLevels(levels ? JSON.parse(levels) : {});
    }, [openCalendar])

    return (
        <>
            <div className="bar-container">
                <h2 className="title">Word Bridge</h2>
                <div className="icons-container">
                    <HelpOutlineIcon onClick={handleOpenHelp} className="icon" />
                    <CalendarMonthIcon onClick={handleOpenCalendar} className="icon" />
                    <LanguageDropdown language={language} setLanguage={setLanguage} />
                </div>
            </div>
            <Modal
                open={openHelp}
                onClose={handleCloseHelp}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{
                    '.MuiPaper-root': {
                        border: '1px solid #ccc', // Bordes consistentes con el resto de la app
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Sombra ligera
                        outline: 'none',
                        borderRadius: '8px', // Bordes redondeados
                        fontFamily: 'inherit', // Usa la misma fuente que el resto de la app
                    },
                }}
            >
                <Grow in={openHelp} timeout={300}>
                    <Box
                        className="box-container"
                        sx={{
                            padding: '30px', // Espaciado interno
                            backgroundColor: '#FAFAF8',
                            borderRadius: '8px', // Bordes redondeados
                            display: 'flex', // Flexbox para dividir en filas
                            flexDirection: 'column', // Cambia a modo columna
                            gap: '20px', // Espaciado entre elementos
                            alignItems: 'center', // Centra horizontalmente
                        }}
                    >
                        {/* Título general centrado */}
                        <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                            sx={{
                                fontWeight: 'bold',
                                color: '#333',
                                fontFamily: 'inherit', // Usa la misma fuente
                                borderBottom: '1px solid #ccc', // Línea inferior para separar el título
                                paddingBottom: '10px',
                                textAlign: 'center', // Centra el texto
                                width: '100%', // Asegura que ocupe todo el ancho
                            }}
                        >
                            How to Play
                        </Typography>

                        {/* Contenedor de texto e imagen */}
                        <Box
                            sx={{
                                display: 'flex', // Flexbox para dividir en filas
                                flexDirection: 'row', // Coloca el texto y la imagen en fila
                                gap: '20px', // Espaciado entre columnas
                                alignItems: 'center', // Alinea verticalmente
                                width: '100%', // Asegura que ocupe todo el ancho
                            }}
                        >
                            {/* Columna izquierda: Texto */}
                            <Box sx={{ flex: 1 }}>
                                <Typography
                                    id="modal-modal-description"
                                    sx={{
                                        mt: 2,
                                        textAlign: 'justify',
                                        fontWeight: 'normal',
                                        color: '#333',
                                        fontFamily: 'inherit', // Usa la misma fuente
                                        lineHeight: '1.6',
                                    }}
                                >
                                    Welcome to "Word Bridge," a unique word association challenge! The game displays two words: one at the bottom and another at the top of your screen. Your task is to connect these words by building a bridge of related words, moving from the bottom to the top.

                                    Starting from the lower word, each connection in your chain should logically lead upwards to your destination word at the top. This game tests your vocabulary and creative thinking skills, challenging you to think outside the box and make clever connections.

                                    Get ready to explore the amazing world of words and climb your way to the top!
                                </Typography>
                            </Box>

                            {/* Columna derecha: GIF */}
                            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                <img
                                    src={exampleGif}
                                    alt="Example GIF"
                                    style={{
                                        maxWidth: '50%', // Reduce el tamaño del GIF al 50% del contenedor
                                        borderRadius: '8px', // Bordes redondeados
                                    }}
                                />
                            </Box>
                        </Box>
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
                        <Typography id="modal-modal-title" variant="h6" component="h2" className='modal-title'>
                            📈 Levels history 📈
                        </Typography>
                        <Grid container spacing={2} className='tiles-container'>
                            {[...dateList].reverse().map((date, index, reversedArray) => (
                                <Grid item xs={'auto'} key={index} className={"calendar-grid"}>
                                    <Box
                                        onClick={() => changeDay(date)}
                                        className={
                                            `tiles ${completedLevels[date] && completedLevels[date][language] && completedLevels[date][language].length > 0
                                                ? "green-tile"
                                                : ""
                                            }`
                                        }
                                    >
                                        {reversedArray.length - index}
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