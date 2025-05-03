import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useCurrentAccount } from '@mysten/dapp-kit';

const BASE_URL = process.env.NODE_ENV === "production" 
  ? "https://infinite-river-28424-7061d8d0450b.herokuapp.com" 
  : "http://localhost:8080";

function GameList() {
  const [games, setGames] = useState([]);
  const [queue, setQueue] = useState([]);
  const navigate = useNavigate();
  const account = useCurrentAccount();

  const startSoloGame = async () => {
    const response = await axios.post(BASE_URL + "/games", {
      player: account.address,
    });
    navigate(`/${response.data.id}`);
  }

  const fetchGames = async () => {
    const response = await axios.get(BASE_URL + "/games?player=" + account.address);
    setGames(response.data);
  };

  const fetchQueue = async () => {
    const response = await axios.get(BASE_URL + "/queue");
    setQueue(response.data);
  }

  const queueForGame = async () => {
    const response = await axios.post(BASE_URL + "/queue", {
      player: account.address,
    });
    setQueue([...queue, response.data]);
  };

  const deleteAllGames = async () => {
    await axios.delete(BASE_URL + "/games");
    setGames([]);
  }

  useEffect(() => {
    fetchQueue();
    fetchGames();
  });

  return (
    <div>
      <button onClick={startSoloGame}>Start solo game</button>
      <button onClick={queueForGame}>Find a match!</button>
      <button onClick={deleteAllGames}>Delete all games</button>
      <h2>Queue</h2>
      <ul>
        {queue.map((address) => (
          <li key={address}>
            Player: {address} {address === account.address ? "(You)" : ""}
          </li>
        ))}
      </ul>
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