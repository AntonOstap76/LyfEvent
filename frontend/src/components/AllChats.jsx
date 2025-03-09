import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import ChatPage from '../pages/ChatPage';
import { Link, useLocation, useNavigate } from "react-router-dom";
import UsersModal from './UsersModal';
import ava from '../assets/img/ava.svg';
import bg_chat from '../assets/img/bg-chat.svg';

const AllChats = () => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [events, setEvents] = useState([]);
  const { user, authTokens } = useContext(AuthContext);
  const location = useLocation(); // Corrected useLocation usage
  const [selectedEvent, setSelectedEvent] = useState(location.state?.Event || null);
  const [modal, setModal] = useState(false);

  const [filteredChats, setFilteredChats] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState({});

  useEffect(() => {
    getChats();
  }, [user]);

  useEffect(() => {
    getEvents();
  }, [user]);

  useEffect(() => {
    if (selectedChatId) {
      const event = events.find((event) => event.id === selectedChat.event);
      setSelectedEvent(event);
    } else {
      return;
    }
  }, [selectedChatId]);

  const getChats = async () => {
    try {
      const response = await fetch('/api/all-user-chats/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(authTokens.access),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setChats(data);
        setFilteredChats(data);
      } else {
        console.error('Failed to fetch chats:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const getEvents = async () => {
    try {
      const response = await fetch('/api/events-list/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(authTokens.access),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        console.error('Failed to fetch events:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    setFilteredChats(chats.filter((chat) => chat.chat_name.toLowerCase().includes(query)));
  };

  const profilePic = async (userId) => {
    const response = await fetch(`/api/profile/${userId}/`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens.access),
      }
    });
    if (response.ok) {
      const data = await response.json();
      return data.avatar;
    }
    return '';
  };

  const handleImageLoad = async (userId) => {
    // Fetch the avatar and set it in the state to prevent repeated calls
    const avatar = await profilePic(userId);
    setAvatars((prevAvatars) => ({
      ...prevAvatars,
      [userId]: avatar || ava,  // Use default avatar if no avatar found
    }));
  };

  return (
    <>
      {/* SIDEBAR LEFT */}
      <div className="flex mb-6">
        <div className="flex flex-col h-[82vh] w-1/4 border-r-2 overflow-y-auto">
          <div className="border-b-2 py-4 px-2">
            <input
              type="text"
              placeholder="Search chats"
              className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
              value={search}
              onChange={handleSearch}
            />
          </div>

          <ul>
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <li
                  key={chat.id}
                  onClick={() => setSelectedChatId(chat.id)}
                  className={`flex flex-row py-4 px-2 items-center border-b-2 cursor-pointer ${
                    selectedChatId === chat.id ? 'border-l-4 border-[#6d6fff] bg-customBlue-50' : ''
                  }`}
                >
                  {/* Ensure image remains visible */}
                  <div className="w-12 h-12 flex-shrink-0">
                    <img
                      src={(() => {
                        const event = events.find(event => event.id === chat.event);
                        return event ? event.image : '';
                      })()}
                      className="object-cover h-12 w-12 rounded-full"
                      alt={chat.chat_name}
                      loading="lazy"
                    />
                  </div>

                  {/* Prevent long chat names from pushing the image away */}
                  <div className="w-full ml-2 overflow-hidden">
                    <div className="truncate text-lg font-semibold max-w-[250px]">
                      {chat.chat_name}
                    </div>
                    <span className="text-gray-500 truncate block max-w-[180px]">{chat.last_message}</span>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-500">No chats found</p>
            )}
          </ul>
        </div>

        {/* CHAT ITSELF */}
        <div className="truncate flex-1 flex-1 ml-6 mr-6 p-4 flex flex-row justify-start items-start relative">
          {selectedChat ? (
            <>
              <div className="truncate flex-1 flex-1 mr-6">
                <ChatPage chat={selectedChat} />
              </div>

              <div className="flex flex-col ml-4">
                {/* SIDEBAR RIGHT 1 */}
                <div className="truncate flex-1 bg-white shadow-md ring-2 ring-black rounded-lg h-[45vh] w-[300px] flex flex-col relative p-4 mb-4">
                  <h1 className="truncate flex-1 flex justify-center text-2xl font-bold text-black mb-2">
                    {selectedChat.chat_name}
                  </h1>

                  <img
                    src={(() => {
                      const event = events.find((event) => event.id === selectedChat.event);
                      return event ? event.image : "";
                    })()}
                    className="w-[80%] h-auto mx-auto rounded-md object-cover shadow-md"
                    alt="Event's name"
                  />

                  {selectedEvent && (
                    <div className="mt-4 space-y-1 text-gray-700">
                      <p className="text-lg font-medium">
                        <span className="font-bold text-black">Location:</span> {selectedEvent.location}
                      </p>
                      <p className="text-lg font-medium">
                        <span className="font-bold text-black">Date:</span>{" "}
                        {new Intl.DateTimeFormat("en-GB", { dateStyle: "short" }).format(new Date(selectedEvent.date))}
                      </p>
                      <p className="text-lg font-medium">
                        <span className="font-bold text-black">Time:</span>{" "}
                        {new Intl.DateTimeFormat("en-US", { timeStyle: "short" }).format(new Date(selectedEvent.date))}
                      </p>
                    </div>
                  )}

                  <Link to={`/event/${selectedChat.event}`} className="mt-auto">
                    <button className="w-full bg-[#6d6fff] text-white py-2 mt-2 rounded-lg text-lg font-semibold shadow-lg hover:bg-gray-800 transition duration-300">
                      See All Info
                    </button>
                  </Link>
                </div>

                {/* SIDEBAR RIGHT 2 (Now below Sidebar 1) */}
                <div className="bg-white shadow-md ring-2 ring-black rounded-lg h-[28vh] w-[300px] flex flex-col relative p-4">
                  {/* Header with participant count */}
                  <h1 className="text-center text-2xl font-bold text-black">
                    Users Joined ({selectedEvent?.participants.length} / {selectedEvent?.capacity})
                  </h1>

                  {/* Host centered */}
                  <div className="flex flex-col  justify-center flex-1">
                    <div
                      onClick={() => navigate('/profile', { state: { user: selectedEvent?.host } })}
                      className="flex items-center gap-3 p-2 hover:bg-customBlue-100 transition cursor-pointer rounded-lg"
                    >
                      <img
                        src={avatars[selectedEvent?.host?.id] || ava}
                        className="ring-1 ring-black w-12 h-12 rounded-full"
                        alt="User"
                        onLoad={() => handleImageLoad(selectedEvent?.host?.id)}
                      />
                      
                      <div className="flex flex-row gap-2 items-center justify-between  overflow-hidden whitespace-nowrap">
                        <span className="font-medium text-lg truncate max-w-[150px]  ">{selectedEvent?.host?.username}</span>
                        <span className="text-xs text-white bg-[#6d6fff] px-2 py-1 rounded-full">Host</span>
                      </div>
                    </div>
                  </div>

                  {/* Button at bottom */}
                  <div className="mt-auto">
                    <button 
                      onClick={() => setModal(true)}
                      className="w-full bg-[#6d6fff] text-white py-2 rounded-lg text-lg font-semibold shadow-lg hover:bg-gray-800 transition duration-300"
                    >
                      See All Users
                    </button>

                    {modal && <UsersModal closeModal={() => setModal(false)} eventID={selectedEvent.id} />}

                  </div>
                </div>

              </div>
            </>
          ) : (
            <div>
              <p className="text-xl font-bold text-gray-600 absolute top-0">Select a chat</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllChats;