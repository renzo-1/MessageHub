import { useEffect, useState, useRef } from "react";
import axios from "axios";
import FlashError from "../flashError";
import io from "socket.io-client";
import { arrowLeft } from "../../assets";
const socket = io("http://localhost:3000/");
const controller = new AbortController();

export default function Messages({ id, currentUser, setHideContacts }) {
  const [error, setError] = useState({ status: 200, message: "" });
  const [isAnimate, setIsAnimate] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => setIsAnimate(true), [id]);

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
    <div className="h-full grid relative">
      <div className="w-full px-10 py-2 lg:py-4 flex justify-center items-center rounded-t-xl bg-slate-700 drop-shadow-lg z-10 relative">
        <img
          className="w-5 lg:w-7 cursor-pointer absolute left-4 lg:left-7"
          src={arrowLeft}
          alt="contact button"
          onClick={(e) => setHideContacts(false)}
        />
        <h1 className="text-xl self-center font-bold lg:text-3xl text-slate-100 tracking-widest">
          {messages.length > 0 &&
            (currentUser === messages[0].sender
              ? messages[0].receiver
              : messages[0].sender)}
        </h1>
      </div>
      {isAnimate && (
        <div className="top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 absolute">
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}

      <div
        onAnimationEnd={(e) => setIsAnimate(false)}
        className={`${
          isAnimate && "animate-load"
        } w-full p-5 rounded-bl-lg rounded-br-xl bg-lighter-grey drop-shadow-lg overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-thin scrollbar-thumb-rounded-lg scrollbar-thumb-slate-100 scrollbar-track-transparent`}
      >
        {messages.map((m, i) => (
          <div key={i} className="flex flex-col">
            <p
              className={`${
                currentUser === m.sender
                  ? "text-slate-100 bg-sender self-end"
                  : "text-slate-900 bg-receiver"
              } text-base w-fit max-w-[200px] p-2 mb-2 lg:text-lg lg:p-4 rounded-lg tracking-wider break-words relative`}
            >
              {m.body}
            </p>
            <span
              className={
                currentUser === m.sender
                  ? "text-gray-400 text-[10px] self-end mb-7 tracking-wider"
                  : "text-gray-400 text-[10px] mb-7 tracking-wider"
              }
            >
              {m.creationTime}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      <form
        className="mt-4 flex  justify-center  text-slate-100 whitespace-nowrap space-x-2"
        onSubmit={handleSendMessage}
      >
        <input
          className="w-[80%] h-full p-3 overflow-hidden bg-transparent border rounded-lg drop-shadow-lg tracking-wider"
          type="text"
          id="message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write your message here"
          required
        ></input>
        <button className="w-[20%] p-3 bg-slate-700 border rounded-lg drop-shadow-lg">
          Send
        </button>
      </form>
    </div>
  );
}
