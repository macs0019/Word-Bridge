export function generateDateList() {
    let startDate = new Date("2023-11-21");
    let endDate = new Date();
    let dateArray = [];

    while (startDate <= endDate ) {
        dateArray.push(startDate.toISOString().split('T')[0]);
        startDate.setDate(startDate.getDate() + 1);
    }

    return dateArray;
};

export function changeDate(date, language, setEnd, setWords, setStart, getWordFromSeed, setPlayingDate) {
    const dt = new Date(date);
    const daySeed = dt.getDate();
    const monthSeed = dt.getMonth() + 1;
    const yearSeed = dt.getFullYear();
    let seed = `${yearSeed}${monthSeed}${daySeed}`;

    // Usando la función genérica para obtener la palabra de inicio basada en el seed y el idioma
    let newStart = getWordFromSeed(seed.toString(), language);
    let newEnd = getWordFromSeed((seed + 1).toString(), language);

    // Asegurándose de que el inicio y el final no sean iguales, si es necesario ajustar la lógica para tus necesidades
    while (newStart === newEnd) {
        seed++; // Incrementa el seed para obtener una nueva palabra
        newEnd = getWordFromSeed((seed + 1).toString(), language);
    }

    // Actualizar los estados con las nuevas palabras y la fecha
    console.log("New Start Word:", newStart);
    setStart(newStart);
    setEnd(newEnd);
    setWords(['',newStart]); // Asumiendo que quieres iniciar la lista de palabras con la palabra de inicio
    setPlayingDate(date); // Actualizar la fecha de juego
}

export function dateToLevelNumber(date) {
    const startDate = new Date("2023-11-21"); // Fecha de inicio fija
    const targetDate = new Date(date); // Fecha proporcionada

    // Calcula la diferencia en milisegundos y la convierte a días
    const differenceInTime = targetDate - startDate;
    const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));

    // El nivel comienza en 1, así que suma 1 a la diferencia en días
    return differenceInDays + 1;
}

