import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const BASE_URL = process.env.NODE_ENV === "production" 
  ? "https://infinite-river-28424-7061d8d0450b.herokuapp.com" 
  : "http://localhost:8080";

function GameList() {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      const response = await axios.get(BASE_URL + "/games");
      setGames(response.data);
    };

    fetchGames();
  }, []);

  const createGame = async () => {
    const response = await axios.post(BASE_URL + "/games");
    setGames([...games, response.data]);
  };

  const deleteGame = async (id) => {
    await axios.delete(`${BASE_URL}/games/${id}`);
    setGames(games.filter((game) => game.id !== id));
  };

  return (
    <div>
      <h1>Games</h1>
      <button onClick={createGame}>Create New Game</button>
      <ul>
        {games.map((game) => (
          <li key={game.id}>
            Game ID: {game.id} - FEN: {game.fen}
            <button onClick={() => navigate(`/${game.id}`)}>Open</button>
            <button onClick={() => deleteGame(game.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GameList;