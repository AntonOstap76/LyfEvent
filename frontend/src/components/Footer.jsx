import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';

const Footer = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  const handleRandomJoin = async () => {
    try {
      const tokens = JSON.parse(localStorage.getItem("authTokens"));
      const token = tokens?.access;
  
      if (!token) {
        navigate("/login");
        return;
      }
  
      const response = await fetch("http://127.0.0.1:8000/api/random-event/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (response.status === 401) {
        navigate("/login");
        return;
      }
  
      if (!response.ok) {
        throw new Error("No events available");
      }
  
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
  
      navigate(`/event/${data.id}`); // Redirect to the random event page
    } catch (error) {
      console.error("Error fetching random event:", error);
      alert("No events available at the moment. Try again later!");
    }
  };
  
  

  return (
    <>
      {isMobile ? (
        <footer className="bg-[#6d6fff] text-white pt-8 pb-4">
          <div className="w-full px-8"> {/* Full width container */}
            {/* Mobile Layout */}
            <div className="md:hidden text-center">
              <a href="/">
              <h2 className="text-white text-3xl font-semibold">LyfEvents</h2>
              </a>
              <p className="mt-2 text-sm">Connecting people to meaningful events.</p>

              <div className="flex justify-center space-x-6 mt-4 text-sm">
                <button onClick={() => navigate("/about")} className="hover:underline">About</button>
                <button onClick={() => navigate("/contact")} className="hover:underline">Contact Us</button>
                <button className="cursor-pointer hover:underline" onClick={() => navigate("/chat")}>Chat</button>
                <button
              className="cursor-pointer hover:underline"
              onClick={() => navigate("/events?popular=true")} // ✅ Navigate with query param
            >Popular Events</button>
              </div>

              <div className="flex justify-center space-x-4 mt-4">
                <button className="bg-white text-[#6d6fff] font-semibold px-3 py-1 rounded" onClick={() => navigate("/my-profile")}>Profile</button>
                <button className="bg-white text-[#6d6fff] font-semibold px-3 py-1 rounded" onClick={() => navigate("/create-event")}>Create Event</button>
              </div>
            </div>

            <div className="mt-6 border-t border-white pt-4 text-center text-xs">
              <p>© {new Date().getFullYear()} LyfEvents, Inc. All rights reserved.</p>
            </div>
          </div>
        </footer>
      ) : (
        <footer className="bg-[#6d6fff] text-white text-white pt-12">
          <div className="w-full px-4 md:grid grid-cols-1 md:grid-cols-4 gap-8"> {/* Full width container for desktop */}
            {/* Brand & Socials */}
            <div>
              <a href="/">
                <h2 className="text-white text-6xl font-semibold">LyfEvents</h2>
              </a>
              <p className="mt-2 text-xl">Connecting people to meaningful events.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold">Quick Links</h3>
              <ul className="mt-3 space-y-2 text-sm">
              <li className="cursor-pointer hover:underline" onClick={() => navigate("/about")}>About</li>
              <button 
            onClick={handleRandomJoin} 
            className="bg-[#] hover:underline text-white px-4 rounded"
          >
            Random Event
          </button>

                <li className="cursor-pointer hover:underline" onClick={() => navigate("/contact")}>Contact Us</li>
                <li 
              className="cursor-pointer hover:underline"
              onClick={() => navigate("/events?popular=true")} // ✅ Navigate with query param
            >Popular Events</li>
                <li className="cursor-pointer hover:underline" onClick={() => navigate("/chat")}>Chat</li>

             
              </ul>
            </div>

            {/* Customize Your Profile */}
            <div>
              <h3 className="font-semibold text-xl">Customize Your Profile</h3>
              <p className="mt-4 text-xl">Make your profile truly yours!</p>
              <button
                className="mt-4 bg-[#6d6fff] border-2 text-white font-semibold p-2 w-full rounded"
                onClick={() => navigate("/my-profile")}
              >
                My Profile
              </button>
            </div>


            {/* Event Host CTA */}
            <div>
              <h3 className="font-semibold text-xl">Become a Host</h3>
              <p className="mt-4 text-xl">Start creating your own events today!</p>
              <button
                className="mt-4 bg-[#6d6fff] border-2 text-white font-semibold p-2 w-full rounded"
                onClick={() => navigate("/create-event")}
              >
                Create an Event
              </button>
            </div>
          </div>

          <div className="mt-10 border-t border-white pt-4 text-center text-sm pb-4">
            <p className="text-sm">© {new Date().getFullYear()} LyfEvents, Inc. All rights reserved.</p>
          </div>
        </footer>
      )}
    </>
  );
};

export default Footer;
