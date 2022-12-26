import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar() {
  const [error, setError] = useState({ status: 200, message: "" });
  const navigate = useNavigate();
  function handleLogout() {
    // log out the user from backend
    axios
      .get("/api/logout", { withCredentials: true })
      .then((res) => {
        console.log(res);
        setError({ status: res.status, message: res.statusText });
      })
      .catch((err) => {
        setError({ status: err.response, message: err.response });
      });
    // set the is loggedIn to false so that we can redirect to /login
    localStorage.setItem("isLoggedIn", false);
    navigate("/login");
  }

  return (
    <div className="w-full h-20 absolute top-0 border-b border-slate-700 bg-bg-grey drop-shadow-lg z-10">
      <div className="md:container h-full w-full flex items-center justify-between">
        <h1 className="text-slate-100 text-lg font-bold">MessageHub</h1>
        <button
          onClick={handleLogout}
          type="submit"
          className="text-slate-100 space-x-1 z-20"
          //   href="/login"
        >
          <p className="inline-block">Sign out</p>
          <img
            className="w-7 h-7 inline-block"
            src="/logoutIcon.svg"
            alt="sign out"
          ></img>
        </button>
      </div>
    </div>
  );
}
