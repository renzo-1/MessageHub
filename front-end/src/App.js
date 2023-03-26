import React, { useState } from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import Register from "./components/user/Register";
import Login from "./components/user/Login";
import Main from "./components/messages/Main";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Login />} path="/" />
          <Route element={<Register />} path="/register" />
          <Route element={<Main />} path="/convo" />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
