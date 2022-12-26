import { useEffect, useState, useRef } from "react";
import axios from "axios";
import FlashError from "../flashError";
import io from "socket.io-client";
const socket = io("http://localhost:3000/");
const controller = new AbortController();

export default function Messages({ id, currentUser }) {
  const [error, setError] = useState({ status: 200, message: "" });
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // fetch messages
    axios
      .get(`/api/convo/${id}/message/n`, { withCredentials: true })
      .then((res) => {
        setMessages([...res.data]);
        setError({ status: res.status, message: res.statusText });
      })
      .catch((err) => {
        setError({
          status: err.response.status,
          message: err.response.statusText,
        });
      });

    socket.emit("joinRoom", id);

    // cancel the request before component unmounts
    return () => {
      socket.emit("leaveRoom", id);
      controller.abort();
    };
  }, [id]);

  useEffect(() => {
    socket.on("newMessage", (m) => {
      setMessages((prevMessages) => [...prevMessages, m.data]);
    });
  }, []);

  function handleSendMessage(e) {
    e.preventDefault();
    axios
      .post(`/api/convo/${id}/message/n`, { message: newMessage })
      .then((res) => {
        socket.emit("sendMessage", { res, id });
        setNewMessage("");
        setError({ status: res.status, message: res.statusText });
      })
      .catch((err) => {
        setError({
          status: err.response.status,
          message: err.response.statusText,
        });
      });
  }

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom(messages);
  });

  if (error.status !== 200) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-28 rounded-lg bg-white drop-shadow-lg border border-rose-900 text-center text-2xl">
        <FlashError status={error.status} message={error.message} />
      </div>
    );
  }
  return (
    <>
      <div className="w-full h-10% flex justify-center items-center rounded-t-2xl bg-slate-700 drop-shadow-lg sticky top-0 z-10">
        <h1 className="text-3xl text-slate-100 tracking-widest">
          {messages.length > 0 &&
            (currentUser === messages[0].sender
              ? messages[0].receiver
              : messages[0].sender)}
        </h1>
      </div>
      <div className="w-full h-80% p-8 rounded-bl-3xl rounded-br-xl animate-load bg-lighter-grey drop-shadow-lg overflow-y-auto overflow-x-hidden scroll-mt-100% scroll-smooth scrollbar-thin scrollbar-thumb-rounded-lg scrollbar-thumb-slate-100 scrollbar-track-transparent">
        {messages.map((m, i) => (
          <div key={i} className="flex flex-col">
            <p
              className={
                currentUser === m.sender
                  ? " text-slate-100 w-fit max-w-sm self-end bg-sender p-5 mb-2 text-lg tracking-wider rounded-lg break-words relative"
                  : "text-slate-900 w-fit max-w-sm bg-receiver p-5 mb-2 text-lg rounded-lg tracking-wider break-words relative"
              }
            >
              {m.body}
            </p>
            <span
              className={
                currentUser === m.sender
                  ? "text-gray-300 text-xs self-end mb-7 tracking-wider"
                  : "text-gray-300 text-xs mb-7 tracking-wider"
              }
            >
              {m.creationTime}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      <form
        className="w-full mt-6 text-slate-100 absolute bottom-0 whitespace-nowrap flex justify-center space-x-2"
        onSubmit={handleSendMessage}
      >
        <input
          className="w-90% h-full p-3 overflow-hidden bg-transparent border rounded-lg drop-shadow-lg tracking-wider"
          type="text"
          id="message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write your message here"
          required
        ></input>
        <button className="p-3 w-10% bg-slate-700 border rounded-lg drop-shadow-lg">
          Send
        </button>
      </form>
    </>
  );
}
