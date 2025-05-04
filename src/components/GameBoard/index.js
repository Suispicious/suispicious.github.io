import { useParams } from "react-router";
import { isValidSuiObjectId, normalizeSuiObjectId } from "@mysten/sui/utils";
import GameBoardComponent from "./GameBoardComponent"

function GameBoard() {
  const { id } = useParams();
  const addr = normalizeSuiObjectId(id);
  if (!isValidSuiObjectId(addr)) {
    return <div>Invalid ID</div>;
  }

  return (
    <div>
      <GameBoardComponent id={id} />
    </div>
  );
}

export default GameBoard;