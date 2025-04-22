import { Chessboard } from "react-chessboard";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Chess } from "chess.js";

const BASE_URL = "https://infinite-river-28424-7061d8d0450b.herokuapp.com";

function App() {
  const [game, setGame] = useState(new Chess());
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchGameState = async () => {
      const response = await axios.get(BASE_URL + "/game/1");
      const newGame = new Chess();
      newGame.load(response.data.fen);
      setGame(newGame);
    };

    fetchGameState();

    // Start polling every 5 seconds
    intervalRef.current = setInterval(fetchGameState, 5000);

    return () => {
      // Clear the interval when the component unmounts
      clearInterval(intervalRef.current);
    };
  }, []);

  const handleMove = async (from, to) => {
    const move = game.move({ from, to, promotion: "q" }); // Always promote to queen for simplicity

    if (move) {
      const response = await axios.put(BASE_URL + "/game/1", {
        from,
        to,
      });
      const newGame = new Chess();
      newGame.load(response.data.fen);
      setGame(newGame);
    } else {
      console.error("Invalid move");
    }
  };

  return (
    <div>
      <Chessboard
        id="BasicBoard"
        position={game.fen()}
        onPieceDrop={(sourceSquare, targetSquare) => {
          handleMove(sourceSquare, targetSquare);
        }}
      />
    </div>
  );
}

export default App;
