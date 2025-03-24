import React, { useContext, useState, useEffect } from 'react';
import logo from "../assets/logo/logo.svg";
import { AuthContext } from '../context/AuthContext';
import ChatIcon from './ChatIcon';
import ProfileIcon from './ProfileIcon';

const Header = () => {
  const { user, authTokens } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ws, setWs] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(null)

  
  useEffect (()=>{
    if (user ) {getUnreadChats()}

    console.log('FETCHING')
  },[user])


  useEffect(() => {
    if (!user || !authTokens) return;

    const token = authTokens.access;
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const socket = new WebSocket(
      `${protocol}:///localhost:8000/ws/notifications/?token=${encodeURIComponent(token)}`
    );

    socket.onopen = () => {
      console.log("WebSocket connected for notifications");
      setWs(socket);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "notification" && data.chat_id) {
        // Check if the chat is in the unreadMessages state and increment its count
        setUnreadMessages(true);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [user, authTokens]); 


  const getUnreadChats = async () => {
    try {
      const response = await fetch(`/api/unread-exists/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
  
      if (!response.ok) throw new Error("Failed to fetch chats");
  
      const data = await response.json();
      console.log(data);
  
      // Check if there are unread messages
      if (data.unread_messages && data.unread_messages.length > 0) {
        setUnreadMessages(true); // Properly updating state
      } else {
        setUnreadMessages(false); // Ensure it's false when there are no unread messages
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };
  

  return (
    <header className="bg-white border-gray-200 px-4 lg:px-6 py-3 mt-4 mb-2 shadow-md">
      <div className="flex justify-between items-center mx-auto max-w-screen-xl">

        {/* Logo */}
        <a href="/" className="flex items-center">
          <img src={logo} className="mr-4 h-20 sm:h-20 mb-3" alt="Logo" />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex space-x-6 text-2xl font-medium pb-4">
          {[{ name: "Home", href: "/" }, { name: "Events", href: "/events" }, { name: "My Events", href: "/my-events" }, { name: "Create Event", href: "/create-event" }, { name: "About", href: "/about"}, { name: "Contact", href: "/contact" },].map((item) => (
            <a key={item.href} href={item.href} className="py-2 transition-colors duration-200 text-gray-800 hover:text-customBlue-600">
              {item.name}
            </a>
          ))}
        </nav>

        {/* Right Side - Icons and Auth Links */}
        <div className="flex items-center gap-2 mb-3">
          {user ? (
            <>
              {/* Chat Icon */}


              <a href="/chat" className="relative px-4 py-2 hover:scale-110 transition-transform"
              >
              
                <ChatIcon className="w-7 h-7 sm:w-8 sm:h-8" />

                {unreadMessages && (
                    <span className="absolute top-2 right-2 bg-red-600 w-3 h-3 rounded-full"></span>
                  )}
              </a>

              {/* Profile Icon */}
              <a href="/my-profile" className="p-2 hover:scale-110 transition-transform">
                <ProfileIcon className="w-9 h-7 sm:w-8 sm:h-8" />
              </a>

            </>
          ) : (
            <>
              <a href="/login" className="text-gray-800 text-md sm:text-xl hover:bg-gray-50 rounded-lg px-2 sm:px-4 py-2 sm:py-4 transition-all font-semibold">
                Log in
              </a>

              <a href="/register" className="text-white text-md sm:text-xl bg-customBlue-600 hover:bg-customBlue-700 rounded-lg px-2 sm:px-4 py-2 sm:py-4 ml-2 mr-2 transition-all font-semibold">
                Get started
              </a>
            </>
          )}
        </div>

        {/* Mobile Menu Button - Ensure it's Visible */}
        <button 
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="33" height="33" viewBox="0 0 50 50">
            <path d="M 0 9 L 0 11 L 50 11 L 50 9 Z M 0 24 L 0 26 L 50 26 L 50 24 Z M 0 39 L 0 41 L 50 41 L 50 39 Z"></path>
          </svg>
        </button>

      </div>

      {menuOpen && (
        <div className="lg:hidden flex flex-col items-center bg-white border-t mt-3 py-4 shadow-lg font-semibold">
          {[
            { name: "Home", href: "/" },
            { name: "Events", href: "/events" },
            { name: "My Events", href: "/my-events" },
            { name: "Create Event", href: "/create-event" },
            { name: "About", href: "/about" },
            { name: "Contact", href: "/contact" },
          ].map((item) => (
            <a 
              key={item.href} 
              href={item.href} 
              className="py-2 text-gray-800 hover:text-customBlue-600 transition-colors text-lg"
            >
              {item.name}
            </a>
          ))}
        </div>
      )}

    </header>
  );
};

export default Header;
