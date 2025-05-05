import { Chess } from "chess.js";
import { isSquareNextTo } from "../../utils";

export const specialRules = [
    { id: 0, passive: false, name: 'Back to Life', description: 'Revive a pawn' }, // Putting a new piece
    { id: 1, passive: false, name: 'Blossom Boost', description: 'A piece right beside the Queen can move like the Queen once this season' }, // Move validation
    { id: 2, passive: false, name: 'Bunny Hop', description: 'Pawn jumps two tiles forward' }, // Move validation
    { id: 3, passive: false, name: 'Nest Recall', description: 'Return any one piece to starting square' }, // Move validation

    { id: 4, passive: true, name: 'Scorched Advance', description: 'Move again after a capture' }, // Keeping turn
    { id: 5, passive: true, name: 'Heatwave', description: 'All [piece name] can\'t move this season' }, // Move validation
    { id: 6, passive: true, name: 'BBQ', description: '[white or black tiles] becomes “a grill zone,” move pieces away from the row' }, // Move validation
    { id: 7, passive: true, name: 'Lazy Siesta', description: 'Moved piece naps for the rest of the season' }, // Move validation, with memory

    { id: 8, passive: false, name: 'Wind Swap', description: 'Swap places between 2 of your pieces once this season' }, // Double move
    { id: 9, passive: false, name: 'Gust Glide', description: 'Move through a piece once this season' }, // Move validation
    { id: 10, passive: false, name: 'Leaf Mask', description: 'Disguise a pawn as Queen for this season' }, // Rendering, with memory
    { id: 11, passive: true, name: 'Slippery Spores', description: 'Pieces can\'t stop on [white or black] tiles' }, // Move validation

    { id: 12, passive: true, name: 'Frozen Grip', description: 'Freeze all [piece name] for this season' }, // Move validation
    { id: 13, passive: true, name: 'Shiver Shield', description: 'Pieces on rows 1 and 8 are immune to capture this season' }, // Move validation
    { id: 14, passive: false, name: 'Snowclone', description: 'Place a pawn decoy that melts after Winter' }, // Rendering, with memory
    { id: 15, passive: false, name: 'Slippery Slide', description: 'Move pawn up to 3 tiles in a straight icy slide' }, // Move validation
]

/**
 * 
 * @param {Chess} chess 
 * @param {string} playerColor 
 * @param {string} from 
 * @param {string} to 
 * @param {specialRules[0]} rule 
 * @returns 
 */
export const handleMoveWithSpecialRule = (chess, playerColor, from, to, rule) => {
    if (!rule) throw new Error("No active rule to validate against");
    const color = playerColor[0];

    /**
     * @param {Chess} chess 
     * @param {string} color 
     * @param {string} from 
     * @param {string} to 
     * @returns
     */
    const blossomBurst = (chess, color, from, to) => {
        const piece = chess.get(from);
        if (!piece) throw new Error("No piece found");

        const queen = chess.findPiece({ color, type: "q" })[0];
        if (!queen) throw new Error("No Queen found for this color");

        const nextToQueen = isSquareNextTo(from, queen);
        if (!nextToQueen) throw new Error("Not next to Queen");



        chess.remove(from);
        chess.put({ type: "q", color }, from);
        try {
            chess.move({ from, to }); // Validation can throw an error
            chess.remove(to);
            chess.put({ type: piece.type, color }, to);
        } catch (error) {
            chess.remove(from);
            chess.put({ type: piece.type, color }, from);
            throw error;
        }
        return chess;
    }

    /**
     * @param {Chess} chess 
     * @param {string} color 
     * @param {string} from 
     * @param {string} to 
     * @returns
     */
    const bunnyHop = (chess, color, from, to) => {
        const piece = chess.get(from);
        if (!piece) throw new Error("No piece found");
        if (piece.type !== "p") throw new Error("Not a pawn");
        if (piece.color !== color) throw new Error("Not your piece");
        if (chess.get(to)) throw new Error("Can't move to a square with a piece");

        // Check the move is in the right direction
        const direction = color === "w" ? 1 : -1;
        const fromRank = parseInt(from[1]);
        const toRank = parseInt(to[1]);
        if (fromRank + direction * 2 !== toRank) throw new Error("Invalid move, hop over exactly one square");
        // Check the move is two squares forward
        if (from[0] !== to[0]) throw new Error("Invalid move, stay on your lane");


        chess.remove(from);
        chess.put({ type: "p", color }, to);
        return chess;
    }

    /**
     * @param {Chess} chess 
     * @param {string} color 
     * @param {string} from 
     * @param {Square} to 
     * @returns
     */
    const nestRecall = (chess, color, from, to) => {
        const piece = chess.get(from);
        if (!piece) throw new Error("No piece found");
        if (piece.color !== color) throw new Error("Not your piece");
        if (chess.get(to)) throw new Error("Can't move to a square with a piece");

        const originalPlacements = new Chess().findPiece({ color, type: piece.type });
        if (!originalPlacements) throw new Error("No original placements found"); // No original placements found

        const isOriginalPlacement = originalPlacements.some((placement) => placement === to);
        if (!isOriginalPlacement) throw new Error("Not an original placement"); // Not an original placement

        chess.remove(from);
        chess.put({ type: piece.type, color }, to);
        return chess;
    }

    /**
     * * @param {Chess} chess
     * @param {string} color
     * @param {string} from
     * @param {string} to
     * @returns
     */
    const heatWave = (chess, color, from, to) => {
        const piece = chess.get(from);
        if (!piece) throw new Error("No piece found");
        if (piece.color !== color) throw new Error("Not your piece");
        if (chess.get(to)) throw new Error("Can't move to a square with a piece");

        const isHeatWavePiece = chess.findPiece({ color, type: piece.type }).some((placement) => placement === from);
        if (!isHeatWavePiece) throw new Error("Not a heatwave piece"); // Not a heatwave piece

        chess.remove(from);
        chess.put({ type: piece.type, color }, to);
        return chess;
    }

    // Move based rules
    switch (rule.id) {
        case 1: // Blossom Boost
            return blossomBurst(chess, color, from, to);
        case 2: // Bunny Hop
            return bunnyHop(chess, color, from, to);
        case 3: // Nest Recall
            return nestRecall(chess, color, from, to);
        case 5: // Heatwave
            return heatWave(chess, color, from, to);
        default:
            break;
    }

    return chess;
};
