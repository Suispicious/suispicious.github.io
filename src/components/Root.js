import GameList from "./GameList";
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';

function Root() {
  const account = useCurrentAccount();

  return (
    <div>
      Login:
      <ConnectButton />
      {account && <p>Connected account: {account.address}</p>}
      <h1>Game List</h1>
      <GameList />
    </div>
  );
}

export default Root;