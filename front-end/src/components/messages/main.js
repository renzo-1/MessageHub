import React, { useState, useEffect, useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import FlashError from "../flashError";
import Messages from "./messages";
import SearchContact from "./searchContact";
import Navbar from "../navbar";

const controller = new AbortController();

export default function Main() {
  const [error, setError] = useState({ status: 200, message: "" });
  const [selectedConvo, setSelectedConvo] = useState(null);
  const [deleteConvoID, setDeleteConvoID] = useState("");
  const [userData, setUserData] = useState({
    currentUser: {},
    convoList: [],
  });

  useEffect(() => {
    // load user data
    axios
      .get("/api/convo", { withCredentials: true })
      .then((res) => {
        setUserData({
          currentUser: res.data.contactInfo,
          convoList: res.data.convoList,
        });
      })
      .catch((err) => {
        setError({ status: err.response.status, message: err.message });
        console.log(err);
      });

    return () => {
      controller.abort();
    };
  }, []);

  function handleDeleteConvo(e) {
    axios
      .post(`/api/convo/${deleteConvoID}?_method=DELETE`, {
        withCredentials: true,
      })
      .catch((err) => {
        setError({ status: err.response, message: "Server Error" });
      });
  }

  if (error.status !== 200) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-28 rounded-lg bg-white drop-shadow-lg border border-rose-900 text-center text-2xl">
        <FlashError status={error.status} message={error.message} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="md:container h-screen overflow-hidden pt-28 pb-10 flex relative">
        <div className="w-1/4 h-full p-8 mr-8 rounded-3xl bg-lighter-grey drop-shadow-lg">
          {<SearchContact />}
          <ul className="mt-8 space-y-3">
            {userData.convoList.map((convo, i) => (
              <li className="list-none relative flex items-center" key={i}>
                <button
                  className="w-full py-2 border-b border-slate-700 text-xl text-left font-medium text-slate-100 tracking-widest"
                  onClick={() => setSelectedConvo(convo._id)}
                  // href={`/convo/${convo._id}`}
                >
                  {userData.currentUser._id === convo.sender._id
                    ? convo.receiver.username
                    : convo.sender.username}
                </button>
                <form
                  className="inline-block absolute right-0 "
                  onSubmit={handleDeleteConvo}
                >
                  <button
                    value={deleteConvoID}
                    onClick={() => {
                      setDeleteConvoID(convo._id);
                    }}
                  >
                    <img
                      className="h-5 w-5"
                      src="/deleteIcon.svg"
                      alt="delete button"
                    />
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-3/4 h-full relative">
          {selectedConvo && (
            <Messages
              // id={convoID}
              id={selectedConvo}
              currentUser={userData.currentUser.username}
            />
          )}
        </div>
      </div>
    </>
  );
}
