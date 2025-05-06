import { Chess } from "chess.js";
import { isSquareNextTo } from "../../utils";

export const specialRules = [
    { id: 0, passive: false, name: 'Back to Life', description: 'Revive a pawn' }, // Putting a new piece
    { id: 1, passive: false, name: 'Blossom Boost', description: 'A piece right beside the Queen can move like the Queen once this season' }, // Move validation
    { id: 2, passive: false, name: 'Bunny Hop', description: 'Pawn jumps two tiles forward' }, // Move validation
    { id: 3, passive: false, name: 'Nest Recall', description: 'Return any one piece to starting square' }, // Move validation

    { id: 4, passive: true, name: 'Scorched Advance', description: 'Move again after a capture' }, // Keeping turn
    { id: 5, passive: true, name: 'Heatwave', description: 'All [piece name] can\'t move this season', modifier: 'p' }, // Move validation
    { id: 6, passive: true, name: 'BBQ', description: '[light or dark tiles] becomes “a grill zone,” move pieces away from the row', modifier: 'light' }, // Move validation
    { id: 7, passive: true, name: 'Lazy Siesta', description: 'Moved piece naps for the rest of the season' }, // Move validation, with memory

    { id: 8, passive: false, name: 'Wind Swap', description: 'Swap places between 2 of your pieces once this season' }, // Double move
    { id: 9, passive: false, name: 'Gust Glide', description: 'Move through a piece once this season' }, // Move validation
    { id: 10, passive: false, name: 'Leaf Mask', description: 'Disguise a pawn as Queen for this season' }, // Rendering, with memory
    { id: 11, passive: true, name: 'Slippery Spores', description: 'Pieces can\'t stop on [light or dark] tiles', modifier: 'light' }, // Move validation

    { id: 12, passive: true, name: 'Frozen Grip', description: 'Freeze all [piece name] for this season', modifier: 'p' }, // Move validation
    { id: 13, passive: true, name: 'Shiver Shield', description: 'Pieces on rows 1 and 8 are immune to capture this season' }, // Move validation
    { id: 14, passive: false, name: 'Snowclone', description: 'Place a pawn decoy that melts after Winter' }, // Rendering, with memory
    { id: 15, passive: false, name: 'Slippery Slide', description: 'Move pawn up to 3 tiles in a straight icy slide' }, // Move validation
]

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
    if (!originalPlacements) throw new Error("No original placements found");

    const isOriginalPlacement = originalPlacements.some((placement) => placement === to);
    if (!isOriginalPlacement) throw new Error("Not an original placement");

    chess.remove(from);
    chess.put({ type: piece.type, color }, to);
    return chess;
}

/**
 * @param {Chess} chess
 * @param {string} color
 * @param {string} from
 * @param {string} to
 * @returns
 */
const heatWave = (chess, color, from, to, lockedPieceType) => {
    const piece = chess.get(from);
    if (!piece) throw new Error("No piece found");
    if (piece.color !== color) throw new Error("Not your piece");
    if (piece.type === lockedPieceType) throw new Error("Heatwave prevents moving this piece");

    chess.move({ from, to });
    return chess;
}

/**
 * @param {Chess} chess 
 * @param {string} from 
 * @param {string} to 
 * @param {string} enforcedTileColor 
 * @returns 
 */
const bbq = (chess, color, from, to, enforcedTileColor) => {
    const piece = chess.get(from);
    if (!piece) throw new Error("No piece found");
    if (piece.color !== color) throw new Error("Not your piece");
    const enforcedMoves = chess.moves({ verbose: true })
        .filter(move => move.color === color && chess.squareColor(move.from) === enforcedTileColor)

    if (enforcedMoves.length === 0) { // No moves available on the enforced tile color, so move normally
        chess.move({ from, to });
        return chess;
    }

    if (!enforcedMoves.some(move => move.from === from)) {
        throw new Error("Can not move to a square with a piece that's not on the enforced tile color when another piece is on it");
    }

    chess.move({ from, to });
    return chess;
}


/**
 * @param {Chess} chess
 * @param {string} color
 * @param {string} from
 * @param {string} to
 * @returns
 */
const windSwap = (chess, color, from, to) => {
    const fromPiece = chess.get(from);
    const toPiece = chess.get(to);
    if (!fromPiece || !toPiece) throw new Error("No piece found");
    if (fromPiece.color !== color || toPiece.color !== color) throw new Error("Not your piece");

    chess.remove(from);
    chess.remove(to);
    chess.put({ type: toPiece.type, color }, from);
    chess.put({ type: fromPiece.type, color }, to);

    return chess;
}

/**
 * @param {Chess} chess
 * @param {string} color
 * @param {string} from
 * @param {string} to
 * @returns
 */
const gustGlide = (chess, color, from, to) => {
    const piece = chess.get(from);
    if (!piece) throw new Error("No piece found");
    if (piece.color !== color) throw new Error("Not your piece");
    if (chess.get(to)) throw new Error("Can't move to a square with a piece");

    // Check if the move would be valid if the board was empty
    const emptyChess = new Chess();
    emptyChess.clear();
    emptyChess.load(emptyChess.fen().replace(/w|b/g, color), { skipValidation: true });
    emptyChess.put({ type: piece.type, color }, from);
    emptyChess.move({ from, to }); // Throws an error if the move is invalid

    chess.remove(from);
    chess.put({ type: piece.type, color }, to);
    return chess;
}

/**
 * @param {Chess} chess
 * @param {string} color
 * @param {string} from
 * @param {string} to
 * @param {string} blockedTileColor
 * @returns
 */
const slipperySpores = (chess, color, from, to, blockedTileColor) => {
    const piece = chess.get(from);
    if (!piece) throw new Error("No piece found");
    if (piece.color !== color) throw new Error("Not your piece");
    if (chess.get(to)) throw new Error("Can't move to a square with a piece");

    const tileColor = chess.squareColor(to);
    if (tileColor === blockedTileColor) {
        throw new Error("Can't move to a square with a piece that's on the blocked tile color");
    }

    chess.move({ from, to });
    return chess;
}


/**
 * * @param {Chess} chess
 * @param {string} color
 * @param {string} from
 * @param {string} to
 * @param {string} frozenPieceType
 * @returns
 */
const frozenGrip = (chess, color, from, to, frozenPieceType) => {
    const piece = chess.get(from);
    if (!piece) throw new Error("No piece found");
    if (piece.color !== color) throw new Error("Not your piece");
    if (piece.type === frozenPieceType) throw new Error("Frozen Grip prevents moving this piece");

    chess.move({ from, to });
    return chess;
}

/**
 * @param {Chess} chess
 * @param {string} color
 * @param {string} from
 * @param {string} to
 * @returns
 */
const shiverShield = (chess, color, from, to) => {
    const piece = chess.get(from);
    if (!piece) throw new Error("No piece found");
    if (piece.color !== color) throw new Error("Not your piece");
    const toPiece = chess.get(to);
    if (!toPiece) {
        chess.move({ from, to });
        return chess
    };

    const isOnRow1Or8 = to[1] === "1" || to[1] === "8";
    if (isOnRow1Or8) {
        throw new Error(`Can't capture a piece on row ${to[1]}, it's protected by Shiver Shield`);
    }

    chess.move({ from, to });
    return chess;
}

/**
 * @param {Chess} chess
 * @param {string} color
 * @param {string} from
 * @param {string} to
 * @returns
 */
const slipperySlide = (chess, color, from, to) => { // Sliding can't jump over pieces
    const piece = chess.get(from);
    if (!piece) throw new Error("No piece found");
    if (piece.color !== color) throw new Error("Not your piece");
    if (piece.type !== "p") throw new Error("Not a pawn");
    if (chess.get(to)) throw new Error("Can't move to a square with a piece");
    if (from[0] !== to[0]) throw new Error("Invalid move, stay on your lane");

    // Check the move is in the right direction
    const direction = color === "w" ? 1 : -1;
    const fromRank = parseInt(from[1]);
    const toRank = parseInt(to[1]);
    if (fromRank + direction * 3 !== toRank) throw new Error("Invalid move, slide over exactly two squares");

    // Check that the path is clear
    const nextSquare = chess.get(to[0] + (fromRank + direction));
    const nextSquare2 = chess.get(to[0] + (fromRank + direction * 2));
    if (chess.get(nextSquare)) throw new Error("Can't move to a square with a piece that's in the way");
    if (chess.get(nextSquare2)) throw new Error("Can't move to a square with a piece that's in the way");

    chess.remove(from);
    chess.put({ type: "p", color }, to);
    return chess;
}

/**
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


    // Move based rules
    switch (rule.id) {
        case 1: // Blossom Boost
            return blossomBurst(chess, color, from, to);
        case 2: // Bunny Hop
            return bunnyHop(chess, color, from, to);
        case 3: // Nest Recall
            return nestRecall(chess, color, from, to);
        case 5: // Heatwave
            return heatWave(chess, color, from, to, rule.modifier);
        case 6: // BBQ
            return bbq(chess, color, from, to, rule.modifier);
        case 8: // Wind Swap
            return windSwap(chess, color, from, to);
        case 9: // Gust Glide
            return gustGlide(chess, color, from, to);
        case 11: // Slippery Spores
            return slipperySpores(chess, color, from, to, rule.modifier);
        case 12: // Frozen Grip
            return frozenGrip(chess, color, from, to, rule.modifier);
        case 13: // Shiver Shield
            return shiverShield(chess, color, from, to);
        case 15: // Slippery Slide
            return slipperySlide(chess, color, from, to);
        default:
            break;
    }

    return chess;
};
