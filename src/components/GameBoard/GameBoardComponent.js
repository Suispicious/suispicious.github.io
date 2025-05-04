import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Chessboard } from "react-chessboard";
import axios from "axios";
import { Chess } from "chess.js";
import { useCurrentAccount } from '@mysten/dapp-kit';

const BASE_URL = process.env.NODE_ENV === "production"
  ? "https://infinite-river-28424-7061d8d0450b.herokuapp.com"
  : "http://localhost:8080";

function GameBoardComponent() {
  const { id } = useParams();
  const [game, setGame] = useState({
    chess: new Chess()
  });
  const account = useCurrentAccount();

  useEffect(() => {
    const fetchGame = async () => {
      const response = await axios.get(`${BASE_URL}/games/${id}`);
      const newChess = new Chess();
      newChess.load(response.data.fen);

      setGame({
        ...response.data,
        chess: newChess,
      });
    };

    fetchGame();

    const interval = setInterval(fetchGame, 5000);

    return () => clearInterval(interval);
  }, [id]);

  const handleMove = async (from, to) => {
    try {
      game.chess.move({ from, to, promotion: "q" });
      setGame({
        ...game,
        chess: game.chess,
      });
      const response = await axios.put(`${BASE_URL}/games/${id}`, {
        from,
        to,
      });
      const newGame = new Chess();
      newGame.load(response.data.fen);

      setGame({
        ...response.data,
        chess: newGame,
      });
    } catch (error) {
      console.error("Invalid move", error);
    }
  };

  const isPlayerTurn = () => {
    if (game.chess.turn() === "w") {
      return game.white === account.address;
    }
    return game.black === account.address;
  }

  const isDraggablePiece = ({ piece }) => {
    if (!isPlayerTurn()) return false;
    if (game.chess.isCheckmate()) return false;

    if (!piece.startsWith(game.chess.turn())) {
      return false
    }
    return true
  }

  const playerSideColor = game.black === account.address ? "black" : "white";

  return (
    <div>
      <h1>Your turn? {isPlayerTurn() ? "Yes" : "No"}</h1>

      <div style={{ maxWidth: "50em"}}>
      <Chessboard
        id="GameBoard"
        position={game.chess.fen()}
        onPieceDrop={(sourceSquare, targetSquare) => {
          handleMove(sourceSquare, targetSquare);
        }}
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