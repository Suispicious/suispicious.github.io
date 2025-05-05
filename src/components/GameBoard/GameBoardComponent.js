import { useCurrentAccount } from '@mysten/dapp-kit';
import { Chessboard } from "react-chessboard";

function GameBoardComponent({ game, onPieceDrop, onSquareClick }) {
  const account = useCurrentAccount();

  const isPlayerTurn = () => {
    if (game.chess.turn() === "w") {
      return game.white === account.address;
    }
    return game.black === account.address;
  };

  const isDraggablePiece = ({ piece }) => {
    if (!isPlayerTurn()) return false;
    if (game.chess.isCheckmate()) return false;

    if (!piece.startsWith(game.chess.turn())) {
      return false;
    }
    return true;
  };

  const playerSideColor = game.black === account.address ? "black" : "white"; // For the orientation of the board
  const getPlayerColor = () => {
    if (isPlayerTurn() && game.chess.turn() === "w")
      return "white";
    if (isPlayerTurn() && game.chess.turn() === "b")
      return "black";

    return null
  }

  return (
    <div>
      <h1>Your turn? {isPlayerTurn() ? "Yes" : "No"}</h1>

      <div style={{ maxWidth: "50em" }}>
        <Chessboard
          id="GameBoard"
          position={game.chess.fen()}
          onPieceDrop={(square, piece ) => onPieceDrop(getPlayerColor(), square, piece)}
          onSquareClick={(square, piece) => onSquareClick(getPlayerColor(), square, piece)}
          boardOrientation={playerSideColor}
          isDraggablePiece={isDraggablePiece}
        />
      </div>
      <div>Players:</div>
      <div>White: {game.white === account.address ? "You" : game.white}</div>
      <div>Black: {game.black === account.address ? "You" : game.black}</div>
    </div>
  );
}

export default GameBoardComponent;