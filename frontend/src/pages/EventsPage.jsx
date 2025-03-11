import React, { useState, useEffect } from 'react';
import EventItem from '../components/EventItem';
import Pagination from '../components/Pagination';
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const EventsPage = () => {
  let [events, setEvents] = useState([]);
  let [currentPage, setCurrentPage] = useState(1);
  let [eventsPerPage] = useState(12);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
    let response = await fetch("/api/events-list/");
    let data = await response.json();
    setEvents(data);
  };

  // Get Current Events (Pagination)
  let indexOfLastEvent = currentPage * eventsPerPage;
  let indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  let currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const filterEvents = (e) => {
    e.preventDefault();  // Prevent form submission if inside a form
    
    // Ensure searchText is not empty
    if (!searchText.trim()) {
      console.error("Search text cannot be empty");
      return;
    }

    // Filter events based on searchText
    const filteredEvents = events.filter((event) => 
      event.title.toLowerCase().includes(searchText.toLowerCase()) ||
      event.description.toLowerCase().includes(searchText.toLowerCase())
    );

    navigate("/events-search/", { state: { events: filteredEvents, value: searchText } });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Content Wrapper */}

      <div className="flex items-center mb-6">
        {/* Left Box (Empty or something else) */}
        <div className="flex-shrink-0 w-1/6"></div>

        {/* Center Box (Search Input) */}
        <div className="w-full flex justify-center mb-6">
          <div className="w-full max-w-2xl z-10">
            <div className="relative">
              <form onSubmit={filterEvents}>
                <input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full bg-white placeholder:text-slate-400 text-slate-900 text-md border border-slate-200 rounded-lg
                  pl-3 pr-28 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
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
            <h1 className='flex justify-center text-4xl font-bold text-black mt-4'>All Events</h1>    
          </div>
        </div>

        {/* Right Box (Pagination) */}
        <div className="flex-shrink-0 w-1/6">
          {events.length > 0 && (
            <Pagination
              eventsPerPage={eventsPerPage}
              totalEvents={events.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          )}
        </div>
      </div>

      <div className="px-6">
        {events.length > 0 ? (
          <div className="grid lg:grid-cols-6 gap-6 container mx-auto ">
            {currentEvents.map((event) => (
              <EventItem key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center  ">
            <p className="text-xl font-bold text-gray-600 ">EVENTS COMING...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
