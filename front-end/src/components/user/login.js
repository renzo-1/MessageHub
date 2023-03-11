import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FlashError from "../flashError";
import { heroImg } from "../../assets";
import { styles } from "./styles";

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
          message: "Incorrect username or password",
        });
      });
  }

  // if already logged in redirect to main page
  useEffect(() => {
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
    <div className="container mx-auto h-screen flex flex-col-reverse lg:flex-row lg:justify-between justify-center items-center lg:space-x-44 relative">
      <img
        className="w-full max-w-[350px] sm:max-w-[400px] md:max-w-[450px] lg:max-w-[500px] xl:max-w-[750px] mt-20 lg:mt-0"
        src={heroImg}
        alt="hero"
      />
      <div className={styles.parentForm}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            className={styles.input}
            name="username"
            id="username"
            type="text"
            placeholder="Enter your username"
            required
          />
          <input
            className={styles.input}
            name="password"
            id="password"
            type="password"
            placeholder="Enter your password"
            required
          />
          <button className={styles.button}>Sign In</button>
        </form>
        <div className="text-center text-sm mt-8">
          <p>New to MessageHub?</p>{" "}
          <a href="/register" className="font-bold underline">
            Sign up now
          </a>
        </div>
        {btnClicked && error.status !== 200 && (
          <div className="absolute top-5 p-3 rounded-lg bg-white drop-shadow-sm border border-rose-900">
            <FlashError status={error.status} message={error.message} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
