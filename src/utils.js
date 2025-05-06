/**
 * @param {string} square1 
 * @param {string} square2 
 * @returns {boolean} True if the squares are next to each other, false otherwise
 */
const isSquareNextTo = (square1, square2) => {
    if (!square1 || !square2) throw new Error("Invalid squares provided");

    const [file1, rank1] = square1.split("");
    const [file2, rank2] = square2.split("");

    return Math.abs(file1.charCodeAt(0) - file2.charCodeAt(0)) <= 1 &&
        Math.abs(rank1 - rank2) <= 1;
}


const gameIdToSeasons = (gameId) => {
    if (!gameId) throw new Error("Invalid game ID provided");

    const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];

    return [
        stringToNumber(seasons[0] + gameId),
        stringToNumber(seasons[1] + gameId),
        stringToNumber(seasons[2] + gameId),
        stringToNumber(seasons[3] + gameId)
    ]
}

function stringToNumber(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        hash = (hash << 5) - hash + input.charCodeAt(i); // Simple hash function
        hash |= 0; // Convert to 32-bit integer
    }
    return Math.abs(hash) % 16; // Map to range 0–15
}


module.exports = {
    isSquareNextTo,
    gameIdToSeasons,
}