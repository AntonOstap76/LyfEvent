import React, { useState, useEffect } from 'react';
import EventItem from '../components/EventItem';
import Pagination from '../components/Pagination';
import Footer from "../components/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaCocktail,
  FaMusic,
  FaPaintBrush,
  FaBook,
  FaRunning,
  FaRegSun,
} from "react-icons/fa";
import { HiEmojiHappy } from "react-icons/hi";

const categories = [
  { name: "Sports", icon: <FaRunning className="text-[#6d6fff] text-2xl" /> },
  { name: "Chill", icon: <FaCocktail className="text-[#6d6fff] text-2xl" /> },
  { name: "Music", icon: <FaMusic className="text-[#6d6fff] text-2xl" /> },
  { name: "Arts", icon: <FaPaintBrush className="text-[#6d6fff] text-2xl" /> },
  { name: "Study", icon: <FaBook className="text-[#6d6fff] text-2xl" /> },
  { name: "Fun", icon: <HiEmojiHappy className="text-[#6d6fff] outline-offset-2 text-2xl" /> },
];

const EventsPage = () => {
  let [events, setEvents] = useState([]);
  let [currentPage, setCurrentPage] = useState(1);
  let [eventsPerPage] = useState(12);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isPopular = searchParams.get("popular") === "true";
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      let response = await fetch("/api/events-list/");
      let data = await response.json();
      
      if (isPopular) {
        data = data.filter(event => event.participants.length >= 5);
      }
      
      setEvents(data);
    };
    
    fetchEvents();
  }, [isPopular]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
    setCurrentPage(1);
  };

  const filteredEvents = selectedCategory
    ? events.filter(event => event.category?.toLowerCase() === selectedCategory.toLowerCase())
    : events;

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const filterEvents = (e) => {
    e.preventDefault();
    if (!searchText.trim()) return;
    
    fetch("/api/filter_text/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: searchText }),
    })
      .then(response => response.json())
      .then(data => navigate("/events-search/", { state: { events: data, value: searchText } }))
      .catch(error => console.error("Error fetching data:", error));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center mb-6">
        {!isMobile && <div className="flex-shrink-0 w-1/6"></div>}
        <div className={`w-full flex justify-center mb-6 `}>
        <div className="w-full max-w-2xl z-10 mt-4">
        <div className="relative">
          <form onSubmit={filterEvents}>
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full bg-white placeholder:text-slate-400 text-slate-900 text-md border border-slate-200 rounded-lg
              pl-3 pr-10 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="Search events..."
            />
                <button
                  className="absolute top-2 bottom-2 right-2 flex items-center rounded bg-[#6d6fff] py-1 px-2.5 border border-transparent text-md text-white transition-all hover:scale-125"
                  type="submit"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                  </svg>
                  Search
                </button> 
              </form>
            </div>
            <h1 className="flex justify-center text-4xl font-bold text-black mt-4">All Events</h1>
            <div className="flex justify-center gap-4 my-6">
            {isMobile && (
  <div className="flex flex-wrap justify-center gap-4">
    {categories.map((cat, index) => (
      <button
        key={cat.name}
        className={`flex flex-col items-center w-20 h-20 p-4 rounded-full transition-transform
          ${selectedCategory === cat.name ? "bg-[#6d6fff] text-white ring-4 ring-[#6d6fff] transition-none" : "bg-transparent"}
          hover:scale-110`}
        onClick={() => handleCategoryClick(cat.name)}
      >
        <span className={`text-2xl ${selectedCategory === cat.name ? "text-white" : "text-[#6d6fff]"}`}>
          {React.cloneElement(cat.icon, { className: selectedCategory === cat.name ? "text-white" : "text-[#6d6fff]" })}
        </span>
        <span className="text-sm mt-1 font-semibold">{cat.name}</span>
      </button>
    ))}
  </div>
)}


{!isMobile && categories.map(cat => (
  <button
    key={cat.name}
    className={`flex flex-col items-center w-20 h-20 p-4 rounded-full transition-transform
      ${selectedCategory === cat.name ? "bg-[#6d6fff] text-white ring-4 ring-[#6d6fff] transition-none" : "bg-transparent"}
      hover:scale-110`}
    onClick={() => handleCategoryClick(cat.name)}
  >
    <span className={`text-2xl ${selectedCategory === cat.name ? "text-white" : "text-[#6d6fff]"}`}>
      {/* Apply the same color logic to the icon */}
      {React.cloneElement(cat.icon, { className: selectedCategory === cat.name ? "text-white" : "text-[#6d6fff]" })}
    </span>
    <span className="text-sm mt-1 font-semibold">{cat.name}</span>
  </button>
))}


            </div>
          </div>
        </div>
        {!isMobile && <div className="flex-shrink-0 w-1/6">
          {filteredEvents.length > 0 && (
            <Pagination
              eventsPerPage={eventsPerPage}
              totalEvents={filteredEvents.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          )}
        </div>}
      </div>
      <div className="px-6">
        {filteredEvents.length > 0 ? (
          <div className={`grid ${isMobile ? "grid-cols-1" : "lg:grid-cols-6"} gap-6 container mx-auto`}>
            {currentEvents.map(event => <EventItem key={event.id} event={event} />)}
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <p className="text-xl font-bold text-gray-600">No events found.</p>
          </div>
        )}
      </div>
      {isMobile && filteredEvents.length > 0 && (
        <div className="mt-6 mb-6">
          <Pagination
            eventsPerPage={eventsPerPage}
            totalEvents={filteredEvents.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      )}
    </div>
  );
};

export default EventsPage;