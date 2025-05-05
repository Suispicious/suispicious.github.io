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

module.exports = {
    isSquareNextTo,
}