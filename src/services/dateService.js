const generateDateList = (end) => {
    let startDate = new Date("2023-11-21");
    let endDate = new Date(end);
    let dateArray = [];

    while (startDate <= endDate) {
        dateArray.push(startDate.toISOString().split('T')[0]);
        startDate.setDate(startDate.getDate() + 1);
    }

    return dateArray;
};
export default generateDateList;