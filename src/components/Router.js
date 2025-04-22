import { BrowserRouter, Routes, Route } from "react-router";
import Root from "./Root";
import GameBoard from "./GameBoard";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path=":id" element={<GameBoard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;