import { useState, useEffect } from "react";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import axios from "axios";
import config from "../../config";

function JoinGameButton() {
  const [loading, setLoading] = useState(false);
  const [resources, setResources] = useState({
    matchmakerId: null,
    escrowId: null,
  });
  const { mutateAsync } = useSignAndExecuteTransaction();

  // Fetch resources on mount
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data } = await axios.get(
          (process.env.NODE_ENV === "production"
            ? "https://infinite-river-28424-7061d8d0450b.herokuapp.com"
            : "http://localhost:8080") + "/resources"
        );
        setResources({
          matchmakerId: data.matchmakerId,
          escrowId: data.escrowId,
        });
      } catch (e) {
        setResources({ matchmakerId: null, escrowId: null });
        console.error("Failed to fetch resources", e);
      }
    };
    fetchResources();
  }, []);

  const handleJoin = async () => {
    setLoading(true);
    try {
      const { matchmakerId, escrowId } = resources;
      if (!matchmakerId || !escrowId) throw new Error("Missing resource IDs");
      // Build transaction
      const tx = new Transaction();
      
      // Pay 0.1 SUI fee (use 100_000_000 as a plain number for compatibility)
      const [coin] = tx.splitCoins(tx.gas, [100000000]); // 0.1 SUI in MIST
      tx.moveCall({
        target: `${config.packageId}::matchmaker::join_matchmaker`,
        arguments: [tx.object(matchmakerId), tx.object(escrowId), coin],
      });
      // Sign and execute
      await mutateAsync({ transaction: tx });
      console.log("Transaction executed successfully", tx.getData());
    } catch (e) {
      console.error("Error joining matchmaker:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleJoin}
      disabled={
        loading ||
        !resources.matchmakerId ||
        !resources.escrowId
      }
    >
      {loading ? "Joining..." : "Find a match!"}
    </button>
  );
}

export default JoinGameButton;
