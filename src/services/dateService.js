import { generate, count } from "random-words";

export function generateDateList(end) {
    let startDate = new Date("2023-11-21");
    let endDate = new Date(end);
    let dateArray = [];

    while (startDate <= endDate) {
        dateArray.push(startDate.toISOString().split('T')[0]);
        startDate.setDate(startDate.getDate() + 1);
    }

    return dateArray;
};


export function changeDate(date, language, setEnd, setWords, setStart, getSpanishWordFromSeed, setPlayingDate) {
    const dt = new Date(date);
    const daySeed = dt.getDate();
    const monthSeed = dt.getMonth() + 1;
    const yearSeed = dt.getFullYear();
    let seed = `${yearSeed}${monthSeed}${daySeed}`;

    switch (language) {
        case "es":
            let newSpanishStart = getSpanishWordFromSeed(seed.toString());
            let spanishEnd = getSpanishWordFromSeed((seed + 1).toString());
            while (newSpanishStart === spanishEnd) {
                seed++; // Increment seed to get a new word
                spanishEnd = getSpanishWordFromSeed((seed + 1).toString());
            }
            setEnd(spanishEnd);
            console.log("Inicio: " + newSpanishStart);
            setStart(newSpanishStart);
            setWords([newSpanishStart]);
            break;
        case "cn":
            const newChineseStart = getChineseWordFromSeed(seed.toString());
            let chineseEnd = getChineseWordFromSeed((seed + 1).toString());
            while (newChineseStart === chineseEnd) {
                seed++;
                chineseEnd = getChineseWordFromSeed((seed + 1).toString());
            }
            setEnd(chineseEnd);
            console.log("Inicio: " + newChineseStart);
            setStart(newChineseStart);
            setWords([newChineseStart]);
            break;
        case "de":
            const newGermanStart = getGermanWordFromSeed(seed.toString());
            let germanEnd = getGermanWordFromSeed((seed + 1).toString());
            while (newGermanStart === germanEnd) {
                seed++;
                germanEnd = getGermanWordFromSeed((seed + 1).toString());
            }
            setEnd(germanEnd);
            console.log("Inicio: " + newGermanStart);
            setStart(newGermanStart);
            setWords([newGermanStart]);
            break;
        case "fr":
            const newFrenchStart = getFrenchWordFromSeed(seed.toString());
            let frenchEnd = getFrenchWordFromSeed((seed + 1).toString());
            while (newFrenchStart === frenchEnd) {
                seed++;
                frenchEnd = getFrenchWordFromSeed((seed + 1).toString());
            }
            setEnd(frenchEnd);
            console.log("Inicio: " + newFrenchStart);
            setStart(newFrenchStart);
            setWords([newFrenchStart]);
            break;
        case "it":
            const newItalianStart = getItalianWordFromSeed(seed.toString());
            let italianEnd = getItalianWordFromSeed((seed + 1).toString());
            while (newItalianStart === italianEnd) {
                seed++;
                italianEnd = getItalianWordFromSeed((seed + 1).toString());
            }
            setEnd(italianEnd);
            console.log("Inicio: " + newItalianStart);
            setStart(newItalianStart);
            setWords([newItalianStart]);
            break;
        case "us":
            const newStart = generate({ min: 1, max: 1, seed: seed.toString() })[0];
            let usEnd = generate({ min: 1, max: 1, seed: (seed + 1).toString() })[0];
            while (newStart === usEnd) {
                seed++;
                usEnd = generate({ min: 1, max: 1, seed: (seed + 1).toString() })[0];
            }
            setEnd(usEnd);
            setStart(newStart);
            setWords([newStart]);
            break;
        default:
            break;
    }
    setPlayingDate(date);
}

