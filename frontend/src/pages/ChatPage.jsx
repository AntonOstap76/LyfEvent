import React, { useContext, useEffect, useState, useRef } from "react";
import ChatMessage from "../components/ChatMessage";
import { AuthContext } from "../context/AuthContext";
import { useParams } from "react-router-dom";

const ChatPage = ({ chat }) => {
  let { user, authTokens } = useContext(AuthContext);
  let [messages, setMessages] = useState([]);
  let [onlineUsers, setOnlineUsers] = useState(0);
  const [input, setInput] = useState("");
  const [ws, setWs] = useState(null);
  const chatContainerRef = useRef(null);
  let [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    const checkJoined = async () => {
      try {
        let response = await fetch(`/api/chat/${chat.id}`, {
          headers: {
            Authorization: `Bearer ${authTokens.access}`, // Include token if required
          },
        });

        if (response.ok) {
          let data = await response.json();
          const isUserJoined = data.chat_group.participants.some(
            (participant) => participant === user.user_id
          );

          setIsJoined(isUserJoined);
        } else if (response.status === 403) {
          setIsJoined(false);
        } else {
          console.error("Error fetching chat data:", response.statusText);
          setIsJoined(false);
        }
      } catch (error) {
        console.error("Network error:", error);
        setIsJoined(false);
      }
    };

    checkJoined();
  }, [chat.id, authTokens.access, user.user_id]);

  // Initialize WebSocket
  useEffect(() => {
    if (!isJoined) return;
    const token = authTokens.access;
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const socket = new WebSocket(
      `${protocol}://localhost:8000/ws/chat/${encodeURIComponent(chat.id)}/?token=${encodeURIComponent(token)}`
    );

    socket.onopen = () => {
      console.log("WebSocket connected");
      setWs(socket);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "chat_message_handler") {
        const newMessage = data.message;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      } else if (data.type === "online_count_handler") {
        setOnlineUsers(data.online_count);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [chat.id, isJoined, authTokens.access]);

  useEffect(() => {
    if (!isJoined) return;
    getMessages();
  }, [chat.id, isJoined, authTokens.access]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const getMessages = async () => {
    try {
      let response = await fetch(`/api/chat/${chat.id}`);
      if (response.ok) {
        let chat_data = await response.json();
        setMessages(chat_data.chat_messages);
      } else {
        console.error("Failed to fetch messages:", response.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.length > 151) return
    if (ws && input.trim()) {
      const data = {
        text: input,
        token: `Bearer ${authTokens.access}`,
      };
      ws.send(JSON.stringify(data));
      setInput("");
    }
  };

  if (!isJoined) {
    return <p>Join event to have access to this chat group.</p>;
  }

  const handleChange = (e) => {
    const newInput = e.target.value;
    if (newInput.length > 151) {
      setError("Message cannot exceed 150 characters.");
    } else {
      setError("");
      setInput(newInput);
    }
  };

  return (
    <div className="container mx-auto ">
      <div className="bg-white shadow-md rounded-lg  h-[80vh]  flex flex-col">
        <div className="p-4 border-b bg-[#6d6fff] text-white rounded-t-lg flex  justify-center  relative">
            <p className="text-xl font-semibold mb-3">{chat.chat_name}</p>
          <p
            id="online_count"
            className="text-sm absolute bottom-1 left-1/2 transform -translate-x-1/2 font-semibold"
          >
            Online: {onlineUsers}
          </p>
        </div>

        <div id="chat_container" className="p-4 flex-1 overflow-y-auto" ref={chatContainerRef}>
          <div id="chatbox" className="mb-2">
            <ul id="chat_messages" className="flex flex-col justify-end gap-2 p-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  authorName={message.author_username}
                  content={message.text}
                />
              ))}
            </ul>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} id="chat_message_form">
            <div className="flex items-center">
              <input
                value={input}
                onChange={handleChange}
                type="text"
                name="text"
                className="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#6d6fff]"
                placeholder="Type a message..."
              />

              <button
                id="send-button"
                type="submit"
                className="bg-[#6d6fff] text-white px-4 py-2 rounded-r-md hover:bg-[#5a5ae6] transition duration-300 font-semibold"
                disabled={input.length > 150}

              >
                Send
              </button>


            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
