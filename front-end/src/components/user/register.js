import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FlashError from "../flashError";
import { styles } from "./styles";
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
        navigate("/");
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
        <div className={styles.parentForm}>
          <h1 className="text-3xl text-center font-bold mb-10">
            Sign up to MessageHub
          </h1>
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
            <button className={styles.button}>Sign Up</button>
          </form>
          <div className="text-center text-sm mt-8">
            <p>Signed up already?</p>{" "}
            <a href="/" className="font-bold underline">
              Click here to login
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
