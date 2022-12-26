import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FlashError from "../flashError";

function Login() {
  const [error, setError] = useState({ status: "", message: "" });
  const [btnClicked, setBtnClicked] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setBtnClicked(true);
    const form = e.target;
    axios
      .post(
        "/api/login",
        { username: form[0].value, password: form[1].value },
        { withCredentials: true }
      )
      .then((res) => {
        localStorage.setItem("isLoggedIn", true);
        navigate("/convo");
      })
      .catch((error) => {
        setError({
          status: error.response.status,
          message: "Error: Incorrect username or password",
        });
        console.log(error);
      });
  }

  // if already logged in redirect to main page
  useEffect(() => {
    console.log(localStorage.getItem("isLoggedIn"));
    if (
      localStorage.getItem("isLoggedIn") &&
      JSON.parse(localStorage.getItem("isLoggedIn")) === true
    ) {
      navigate("/convo");
    } else {
      setError({ status: "", message: "" });
    }
  }, []);

  return (
    <>
      <div className="md:container h-screen flex justify-center items-center space-x-44 relative">
        <img className="max-w-3xl min-w-sm" src="/hero.svg" alt="hero" />
        <div className="w-30% h-1/2 p-16 flex flex-col justify-center items-center rounded-3xl bg-bluish-white drop-shadow-lg">
          {/* <h1 className="text-3xl text-center font-bold mb-10">Sign up to MessageHub</h1> */}
          <form onSubmit={handleSubmit} className="block w-full">
            <label className="block space-y-1 mb-5">
              <span className="block text-lg">Username</span>
              <input
                className="w-full p-3 rounded-2xl border border-slate-300"
                name="username"
                id="username"
                type="text"
                placeholder="Enter your username"
                required
              />
            </label>
            <label className="block space-y-1 mb-8">
              <span className="block text-lg">Password</span>
              <input
                className="w-full p-3 rounded-2xl border border-slate-300"
                name="password"
                id="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </label>
            <button className="w-full p-4 text-2xl rounded-3xl bg-button-color text-slate-100">
              Sign In
            </button>
          </form>
          <div className="text-center mt-3">
            <p>
              New to MessageHub?{" "}
              <a href="/register" className="font-bold underline">
                Sign up now
              </a>
            </p>{" "}
          </div>
          {btnClicked && error.status !== 200 && (
            <div className="absolute top-5 p-3 rounded-lg bg-white drop-shadow-sm border border-rose-900">
              <FlashError status={error.status} message={error.message} />{" "}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Login;
