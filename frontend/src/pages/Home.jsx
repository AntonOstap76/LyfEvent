import React, { useEffect, useState } from "react";
import '../App.css';
import bgImage from '../assets/img/BG.svg';
import Carousele from '../components/Carousele';
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    const [chosenEvents, setChosenEvents] = useState([]);
    const [searchText, setSearchText] = useState("")

    useEffect(() => {
      fetch("api/events-list/") // Modify based on API documentation
        .then((response) => response.json())
        .then((data) => setChosenEvents(data))
        .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const filterEvents = (e) => {
      e.preventDefault();  // Prevent form submission if inside a form
    
      // Check if searchText is empty
      if (!searchText.trim()) {
        console.error("Search text cannot be empty");
        return; // Exit early if no search text
      }
    
      fetch("/api/filter_text/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: searchText }),
      })
        .then((response) => {
          if (!response.ok) {
            // Handle non-200 responses
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          navigate("/events-search/", { state: { events: data, value: searchText } });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };
    
  return (
    <div className="relative min-h-screen flex flex-col justify-start items-center text-left px-6 md:px-20">
      
      {/* Background Image Positioned on the Right */}
      <img 
        src={bgImage} 
        alt="img"
        className="absolute right-0 top-28 sm:h-[70vh] sm:object-cover"
      />

      {/* Search Bar */}
      <div className="w-full max-w-2xl z-10">
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
            className="absolute top-2 bottom-2 right-2 flex items-center rounded bg-[#6d6fff] m-auto
             py-1 px-2.5 border border-transparent text-md text-white transition-all hover:scale-125"
            type="submit"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
              <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
            </svg>
            Search
          </button> 
          </form>

        </div>
      </div>

      {/* Title */}
      <div className="text-center mt-4 z-10">
        <h1 className="text-4xl font-extrabold text-customBlue-600 tracking-wide uppercase leading-tight">
          Never miss a fun again
        </h1>
      </div>

      {/* Content Section */}
      <div className="content flex flex-col md:flex-row justify-between mt-4 w-full max-w-6xl relative z-10">
        
        {/* Left Side - Text */}
        <div className="max-w-2xl flex flex-col">
          <h3 className="text-2xl font-normal text-gray-700 leading-relaxed text-center">
            LyfEvents helps you find all kinds of events where you can meet new people, discover new activities,
            and make lasting memories. Whether it's for fun, work, or learning,
            LyfEvents connects you to events that fit your interests. Join your first event now.
          </h3>
          <div className="mt-12 text">
            <Carousele events={chosenEvents.slice(0, 8)} />
          </div>
        </div>

      </div>

    </div>
  );
};

export default Home;
