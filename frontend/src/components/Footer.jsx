import { FaFacebook, FaInstagram, FaGithub, FaYoutube, FaMoon, FaSun, FaTiktok } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate()

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);



  const [email, setEmail] = useState("");
  const handleSubscribe = () => {
    setEmail(""); // Hide the input after clicking
  };


  const handleRandomJoin = async () => {
    try {
      const response = await fetch("/api/random-event/");
      
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
      alert("No events available at the moment. Try again later!"); // Friendly alert
    }
  };

  return (
    <footer className="bg-[#6d6fff] text-white text-white pt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Socials */}
        <div>
          <h2 className="text-white text-6xl font-semibold">LyfEvents</h2>
          <p className="mt-2 text-xl">Empowering communities by connecting people to meaningful events.</p>
          <div className="flex mt-4 space-x-4 text-xl pl-20">
            <FaTiktok className="hover:text-gray-300 cursor-pointer" />
            <FaInstagram className="hover:text-gray-300 cursor-pointer" />
            <FaGithub className="hover:text-gray-300 cursor-pointer" />
            <FaYoutube className="hover:text-gray-300 cursor-pointer" />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold">Quick Links</h3>
          
          <ul className="mt-3 space-y-2 text-sm">
            
          <li 
              className="cursor-pointer hover:underline"
              onClick={() => navigate("/events?popular=true")} // ✅ Navigate with query param
            >
              Popular Events
            </li>
            <li className="cursor-pointer hover:underline"
            onClick={() => navigate("/about")}>About</li>
            
            <li className="cursor-pointer hover:underline"
            onClick={() => navigate("/chat")}
            >Chat</li>
            <button 
            onClick={handleRandomJoin} 
            className="bg-[#] hover:underline text-white px-4 rounded"
          >
            Random Event
          </button>
          <li className="cursor-pointer hover:underline"
            onClick={() => navigate("/contact")}
            >Contact</li>
          </ul>
          
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold">Subscribe to Updates</h3>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-3 p-2 w-full rounded text-black"
          />
          <button
            className="mt-2 bg-[#6d6fff] border-2 text-white font-semibold p-2 w-full rounded"
            onClick={handleSubscribe}
          >
            Subscribe
          </button>
          
        </div>

        {/* Event Host CTA */}
        <div>
          <h3 className="font-semibold">Become an Organizer</h3>
          <p className="mt-4 text-xl">Start hosting own events today!</p>
          <button 
      className="mt-4 bg-[#6d6fff] border-2 text-white font-semibold p-2 w-full rounded"
      onClick={() => navigate("/create-event")}
    >
      Get Started
    </button>
        </div>
        
      </div>


      <div className="mt-10 border-t border-white pt-4 text-center text-sm pb-4">
      <p className="text-sm">© {new Date().getFullYear()} LyfEvents, Inc. All rights reserved.</p>
      </div>
      
    </footer>
  );
};

export default Footer;