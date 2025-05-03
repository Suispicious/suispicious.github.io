import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Chessboard } from "react-chessboard";
import axios from "axios";
import { Chess } from "chess.js";

const BASE_URL = process.env.NODE_ENV === "production"
  ? "https://infinite-river-28424-7061d8d0450b.herokuapp.com"
  : "http://localhost:8080";

function GameBoardComponent() {
  const { id } = useParams();
  const [game, setGame] = useState(new Chess());

  useEffect(() => {
    const fetchGame = async () => {
      const response = await axios.get(`${BASE_URL}/games/${id}`);
      const newGame = new Chess();
      newGame.load(response.data.fen);
      setGame(newGame);
    };

    fetchGame();

    const interval = setInterval(fetchGame, 5000);

    return () => clearInterval(interval);
  }, [id]);

  const handleMove = async (from, to) => {
    try {
      game.move({ from, to, promotion: "q" });
      setGame(game);
      const response = await axios.put(`${BASE_URL}/games/${id}`, {
        from,
        to,
      });
      const newGame = new Chess();
      newGame.load(response.data.fen);
      setGame(newGame);
    } catch (error) {
      console.error("Invalid move", error);
    }
  };

  return (
    <div>
      <Chessboard
        id="GameBoard"
        position={game.fen()}
        onPieceDrop={(sourceSquare, targetSquare) => {
          handleMove(sourceSquare, targetSquare);
        }}
      />
    </div>
  );
}

export default GameBoardComponent;