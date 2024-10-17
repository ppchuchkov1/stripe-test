import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("https://test-express-docker-1.onrender.com");

const ChatRoom = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [room, setRoom] = useState("");

  useEffect(() => {
    // Създаване на слушателя само веднъж при първоначално зареждане на компонента
    socket.on("message", (msg) => {
      setChat((prevChat) => [...prevChat, msg]);
    });

    // Важно: премахване на слушателя при unmount на компонента, за да се избегне дублиране
    return () => {
      socket.off("message");
    };
  }, []); // Празен масив, за да се изпълни само веднъж

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("joinRoom", { room });
    }
  };

  const sendMessage = () => {
    if (message !== "") {
      socket.emit("chatMessage", { room, message });
      setMessage("");
    }
  };

  return (
    <div>
      <h1>Стая: {room}</h1>
      <input
        type="text"
        placeholder="Enter room"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>

      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send Message</button>

      <div>
        <h2>Chat Messages</h2>
        {chat.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
  );
};

export default ChatRoom;
