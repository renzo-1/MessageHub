import axios from "axios";
import React, { useState, useEffect } from "react";
import FlashError from "../flashError";
const controller = new AbortController();

export default function SearchContact() {
  const [result, setResult] = useState();
  const [username, setUsername] = useState("");
  const [error, setError] = useState({ status: 200, message: "" });
  const [addUserID, setAddUserID] = useState("");

  function handleSearchUser(e) {
    e.preventDefault();
    axios
      .get(`/api/convo?username=${username}`, { withCredentials: true })
      .then((res) => {
        setResult(res.data);
      })
      .catch((err) => {
        setError({ status: err.response, message: err.response });
      });
    setUsername(username);
  }

  function handleAddUser(e) {
    axios
      .post(`/api/convo`, { withCredentials: true, id: addUserID })
      .catch((err) => {
        setError({ status: err.response, message: err.response });
      });
  }
  if (error.status !== 200) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-28 rounded-lg bg-white drop-shadow-lg border border-rose-900 text-center text-2xl">
        <FlashError
          status={error.status.status}
          message={error.message.statusText}
        />
      </div>
    );
  }

  return (
    <>
      <div>
        <form
          className="w-full whitespace-nowrap relative flex items-center"
          onSubmit={handleSearchUser}
        >
          <input
            className="p-2 w-full text-slate-100 rounded-2xl border bg-transparent border-slate-300"
            required
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Find user"
          />
          <button className="p-3 absolute right-0">
            <img className="h-4 w-4" src="/searchIcon.svg" />
          </button>
        </form>
        {result && result.length > 0 && (
          <div className="p-3 w-full rounded-b-2xl bg-lighter-grey drop-shadow-lg">
            <form
              className="whitespace-nowrap flex items-center justify-center space-x-2"
              onSubmit={handleAddUser}
            >
              <h3 className="font-light text-lg text-slate-100">
                {result[0].username}
              </h3>
              <button
                value={addUserID}
                onClick={() => setAddUserID(result[0]._id)}
              >
                <img
                  className="h-6 w-6"
                  src="/addContact.svg"
                  alt="delete button"
                />
              </button>
            </form>
          </div>
        )}
        {result && result.length === 0 && (
          <div className="p-3 w-full rounded-b-2xl bg-lighter-grey drop-shadow-lg">
            <h3 className="font-medium text-md text-slate-100">
              No User Found
            </h3>
          </div>
        )}
      </div>
    </>
  );
}
