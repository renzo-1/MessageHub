import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FlashError from "../flashError";

function Register() {
  const [error, setError] = useState({ status: "", message: "" });
  const navigate = useNavigate();
  const [btnClicked, setBtnClicked] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBtnClicked(true);
    const form = e.target;
    axios
      .post("/api/register", {
        username: form[0].value,
        password: form[1].value,
      })
      .then((res) => {
        navigate("/login");
      })
      .catch((error) => {
        setError({
          status: error.response.status,
          message: error.response.data.message,
        });
      });
  }

  return (
    <>
      <div className="md:container h-screen flex justify-center items-center relative">
        {btnClicked && error.status !== 200 && (
          <div className="absolute top-5 p-3 rounded-lg bg-white drop-shadow-sm border border-rose-900">
            <FlashError status={error.status} message={error.message} />{" "}
          </div>
        )}
        <div className="w-1/3 h-1/2 p-12 flex flex-col justify-center rounded-lg bg-bluish-white drop-shadow-lg">
          <h1 className="text-3xl text-center font-bold mb-10">
            Sign up to MessageHub
          </h1>
          <form onSubmit={handleSubmit} className="block">
            <label className="block space-y-1 mb-5">
              <span className="block text-lg">Username</span>
              <input
                className="w-full p-3 rounded-3xl border border-slate-300"
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
                className="w-full p-3 rounded-3xl border border-slate-300"
                name="password"
                id="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </label>
            <button className="w-full p-4 text-2xl rounded-3xl bg-button-color text-slate-100 ">
              Sign Up
            </button>
          </form>
          <div className="text-center mt-3">
            <p>
              Signed up already?{" "}
              <a href="/login" className="font-bold underline">
                Click here to login
              </a>
            </p>{" "}
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
