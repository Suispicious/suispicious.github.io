import React from "react";
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";
import GameList from "./components/GameList";
import GameBoard from "./components/GameBoard";

export default function Root() {
  console.log('Hello')
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GameList />} />
        <Route path=":id" element={<GameBoard />} />
      </Routes>
    </BrowserRouter>
  );
}


const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
