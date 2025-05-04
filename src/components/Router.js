import { BrowserRouter, Routes, Route } from "react-router";
import Root from "./Root";
import GameBoard from "./GameBoard";
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';

function Router() {
  const account = useCurrentAccount();
  if (!account) return (
    <div>
      <ConnectButton />
    </div>
  )

  return (
    <div>
      <ConnectButton />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path=":id" element={<GameBoard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Router;