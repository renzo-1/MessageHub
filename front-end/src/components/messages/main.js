import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import FlashError from "../FlashError";
import Messages from "./Messages";
import SearchContact from "./SearchContact";
import Navbar from "../Navbar";
import Contacts from "./Contacts";
const controller = new AbortController();

export default function Main() {
  const [error, setError] = useState({ status: 200, message: "" });
  const [selectedConvo, setSelectedConvo] = useState("");
  const [hideContacts, setHideContacts] = useState(false);
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
      <div className="container h-[90%] p-2 sm:p-0 sm:py-4 lg:py-4 overflow-hidden grid grid-cols-1 grid-rows-1 relative">
        {hideContacts ? (
          selectedConvo && (
            <Messages
              id={selectedConvo}
              currentUser={userData.currentUser.username}
              setHideContacts={setHideContacts}
            />
          )
        ) : (
          <div className="w-full max-w-[1000px] mx-auto flex flex-col pt-10 px-10 rounded-xl md:rounded-2xl bg-lighter-grey drop-shadow-lg">
            <SearchContact />
            <Contacts
              userData={userData}
              setSelectedConvo={setSelectedConvo}
              setHideContacts={setHideContacts}
              setError={setError}
            />
          </div>
        )}
      </div>
    </>
  );
}
