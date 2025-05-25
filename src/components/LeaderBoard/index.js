import { useEffect, useState } from "react";
import axios from "axios";
import { useCurrentAccount } from '@mysten/dapp-kit';

const BASE_URL = process.env.NODE_ENV === "production" 
  ? "https://infinite-river-28424-7061d8d0450b.herokuapp.com" 
  : "http://localhost:8080";

function LeaderBoard() {
  const [leaderboard, setLeaderboard] = useState(null);
  const [leaderboardId, setLeaderboardId] = useState(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [topPlayerScores, setTopPlayerScores] = useState([]);
  const [topPlayersIds, setTopPlayersIds] = useState([]);
  const account = useCurrentAccount();

  useEffect(() => {
    if (!account?.address) return;

    const fetchLeaderboard = async () => {
      const response = await axios.get(BASE_URL + "/leaderboard");
      setLeaderboard(response.data.table);
      setLeaderboardId(response.data.leaderboardId);
    };

    fetchLeaderboard();
  }, [account?.address]);

  useEffect(() => {
    if (!leaderboardId) return;

    const fetchTopPlayers = async () => {
      const response = await axios.get(BASE_URL + "/leaderboard/" + leaderboardId + "/top_players");
      setTopPlayersIds(response.data.topPlayerIds);
      setTopPlayerScores(response.data.topPlayerScores);
    };

    fetchTopPlayers();
  }, [leaderboardId]);

  useEffect(() => {
    if (!leaderboard || !account?.address) return;

    const fetchPlayerScore = async () => {
      const response = await axios.get(BASE_URL + "/table/" + leaderboard?.id?.id + "/player/" + account.address);
      setPlayerScore(response.data.score);
    };

    fetchPlayerScore();
  }, [leaderboard, account?.address]);

  const fetchPlayerScore = async () => {
    if (!leaderboard || !account.address) return;
    const response = await axios.get(BASE_URL + "/table/" + leaderboard?.id?.id + "/player/" + account.address);
    setPlayerScore(response.data.score);
  }
  
  const handleIncrementWinnerScore = async () => {
    await axios.put(BASE_URL + "/leaderboard/" + leaderboardId, {
      winnerId: account.address,
    });
    fetchPlayerScore()
  }

  if (!leaderboardId || !leaderboard || !account) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Leaderboard</h1>
      <button onClick={handleIncrementWinnerScore}>Increment</button>
      <h1>Player Score</h1>
      {topPlayersIds ? (
        topPlayersIds.map((playerId, index) => (
          <div key={playerId}>
            <p>Player ID: {playerId} - Score: {topPlayerScores[index]}</p>
          </div>
        ))
      ) : null
      }
      <div>
        <p>Your Score: {playerScore}</p>
      </div>
    </div>
  );
}

export default LeaderBoard;