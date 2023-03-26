import React, { useState } from "react";
import { deleteIcon } from "../../assets";
import axios from "axios";
const Contacts = ({
  userData,
  setSelectedConvo,
  setError,
  setHideContacts,
}) => {
  const [deleteConvoID, setDeleteConvoID] = useState("");

  function handleDeleteConvo(e) {
    axios
      .post(`/api/convo/${deleteConvoID}?_method=DELETE`, {
        withCredentials: true,
      })
      .catch((err) => {
        setError({ status: err.response, message: "Server Error" });
      });
  }

  return (
    <ul className="mt-8 ">
      {userData.convoList.map((convo, i) => (
        <li
          className="list-none relative flex items-center py-4 border-b border-slate-700"
          key={i}
        >
          <button
            className="w-full  text-xl text-left font-medium text-slate-100 tracking-widest"
            onClick={() => {
              setSelectedConvo(convo._id);
              setHideContacts(true);
            }}
            // href={`/convo/${convo._id}`}
          >
            {userData.currentUser._id === convo.sender._id
              ? convo.receiver.username
              : convo.sender.username}
          </button>
          <form className="h-5 w-5" onSubmit={handleDeleteConvo}>
            <button
              value={deleteConvoID}
              onClick={() => {
                setDeleteConvoID(convo._id);
              }}
            >
              <img className="h-5 w-5" src={deleteIcon} alt="delete button" />
            </button>
          </form>
        </li>
      ))}
    </ul>
  );
};

export default Contacts;
