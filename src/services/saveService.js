export function saveCompletedLevels(date, levels, languageCode) {
    const existingDataString = localStorage.getItem('completedLevels');
    const completedLevels = existingDataString ? JSON.parse(existingDataString) : {};

    // Verificar si ya existe la entrada para la fecha dada
    if (!completedLevels[date]) {
        completedLevels[date] = {}; // Inicializar un nuevo objeto para esa fecha si no existe
    }

    // Actualizar el objeto con los nuevos niveles completados para la fecha e idioma dados
    completedLevels[date][languageCode] = levels;

    // Guardar el objeto actualizado de vuelta en el Local Storage
    localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
}