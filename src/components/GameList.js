import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useCurrentAccount } from '@mysten/dapp-kit';
import JoinGameButton from "./JoinGameButton";

const BASE_URL = process.env.NODE_ENV === "production" 
  ? "https://infinite-river-28424-7061d8d0450b.herokuapp.com" 
  : "http://localhost:8080";

function GameList() {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();
  const account = useCurrentAccount();

  const deleteAllGames = async () => {
    await axios.delete(BASE_URL + "/games");
    setGames([]);
  }

  useEffect(() => {
    const fetchGames = async () => {
      const response = await axios.get(BASE_URL + "/games?player=" + account.address);
      setGames(response.data);
    };
  
    fetchGames();
  }, [account.address]);

  return (
    <div>
      <JoinGameButton />
      <button onClick={deleteAllGames}>Delete all games</button>
      <h1>Games</h1>
      <ul>
        {games.map((game) => (
          <li key={game.id}>
            Game ID: {game.id} - FEN: {game.fen}
            <button onClick={() => navigate(`/${game.id}`)}>Open</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GameList;