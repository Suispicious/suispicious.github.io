import { useParams } from "react-router";
import { isValidSuiObjectId, normalizeSuiObjectId } from "@mysten/sui/utils";
import GameBoardComponent from "./GameBoardComponent"

function GameBoard() {
  const { id } = useParams();
  const addr = normalizeSuiObjectId(id);
  if (!isValidSuiObjectId(addr) && false) {
    return <div>Invalid ID</div>;
  }

  return (
    <div>
      <h1>Game ID: {id}</h1>
      <GameBoardComponent id={id} />
    </div>
  );
}

export default GameBoard;