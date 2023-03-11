import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logoutIcon } from "../assets";

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
    navigate("/");
  }

  return (
    <div className="w-full h-[10%] top-0 border-b border-slate-700 bg-primary drop-shadow-lg z-10">
      <div className="px-2 sm:px-0 container h-full w-full flex items-center justify-between">
        <h1 className="text-slate-100 text-lg font-bold">MessageHub</h1>

        <button
          onClick={handleLogout}
          type="submit"
          className="text-slate-100 space-x-1 z-20"
        >
          <acronym title="Sign Out">
            <img
              className="w-7 h-7 inline-block"
              src={logoutIcon}
              alt="sign out"
            ></img>
          </acronym>
        </button>
      </div>
    </div>
  );
}
