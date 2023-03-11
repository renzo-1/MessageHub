import React, { useState } from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import Register from "./components/user/register";
import Login from "./components/user/login";
import Main from "./components/messages/main";
import Navbar from "./components/navbar";
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
