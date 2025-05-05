import { useParams } from "react-router";
import { isValidSuiObjectId, normalizeSuiObjectId } from "@mysten/sui/utils";
import GameBoardComponent from "./GameBoardComponent"
import SeasonComponent from "./SeasonComponent";
import { useEffect, useState } from "react";
import axios from "axios";
import { Chess } from "chess.js";
import { specialRules, handleMoveWithSpecialRule } from "./specialRules";

const BASE_URL = process.env.NODE_ENV === "production"
  ? "https://infinite-river-28424-7061d8d0450b.herokuapp.com"
  : "http://localhost:8080";



function GameBoard() {
  const { id } = useParams();
  const addr = normalizeSuiObjectId(id);
  const [game, setGame] = useState({
    id: addr,
    chess: new Chess(),
    specialRules: {}
  });
  const [activeRule, setActiveRule] = useState(null);

  useEffect(() => {
    if (!isValidSuiObjectId(addr)) return;

    const fetchGame = async () => {
      const response = await axios.get(`${BASE_URL}/games/${addr}`);
      const newChess = new Chess();
      newChess.load(response.data.fen);

      setGame({
        specialRules: { // Hardcoded for now, but should be fetched from the server
          seasons: { // Maybe just "current rule" is enough if we keep a full list of rules outside the game object and map to seasons separately
            current: 0,
            rules: [0, 5, 8, 12],
          }
        },
        ...response.data,
        chess: newChess,
      });
    };

    fetchGame();

    const interval = setInterval(fetchGame, 5000);

    return () => clearInterval(interval);
  }, [id, addr]);

  const handleMove = async (playerColor, from, to) => {
    try {
      if (activeRule) {
        game.chess = handleMoveWithSpecialRule(game.chess, playerColor, from, to, activeRule);
      } else {
        game.chess.move({ from, to, promotion: "q" });
      }
      setGame({
        ...game,
        chess: game.chess,
      });
      const response = await axios.put(`${BASE_URL}/games/${addr}`, {
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

  const onSquareClick = (playerColor, square, piece) => {
    if (!activeRule) return;

    
    if (activeRule.id === specialRules[0].id) { // How to make this better?
      if (piece) return;
      if ((playerColor === "white" && square.includes("2")) || (playerColor === "black" && square.includes("7"))) {

        game.chess.put({ type: "p", color: playerColor[0] }, square);
        setGame({
          ...game,
          chess: game.chess,
        });
      }
    }
  }

  const handleActivateRule = async (ruleId) => {
    const rule = specialRules.find((rule) => rule.id === ruleId);
    if (!rule) {
      console.error("Rule not found:", ruleId);
      return;
    }
    setActiveRule(rule);
  }

  if (!isValidSuiObjectId(addr)) {
    return <div>Invalid ID</div>;
  }

  return (
    <div>
      {activeRule && <div>Active Rule: {activeRule.name}</div>}
      <GameBoardComponent game={game} onPieceDrop={handleMove} onSquareClick={onSquareClick} />
      {game?.specialRules?.seasons && <SeasonComponent
        activeRule={activeRule}
        gameRules={game.specialRules.seasons}
        specialRules={specialRules}
        handleActivate={handleActivateRule}
      />}
    </div>
  );
}

export default GameBoard;