import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EventItem from '../components/EventItem';
import Pagination from '../components/Pagination';
import Footer from "../components/Footer";

const EventsFiltered = () => {
  let [currentPage, setCurrentPage] = useState(1);
  let [eventsPerPage] = useState(12);
  const navigate = useNavigate();
  const location = useLocation();  // To access the passed state
  const { events, value, valueCat } = location.state || {}; // Destructure the state
  const [searchText, setSearchText] = useState(value)
  const [category,  setCategory]=useState(valueCat)
  const [isOpen, setIsOpen] = useState(false);
  const options = ["Arts", "Music", "Sports","Entertainment", "Study", "Chill"];

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get Current Events (Pagination)
  let indexOfLastEvent = currentPage * eventsPerPage;
  let indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  let currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  const filterCategoryEvents = (e) => {
    e.preventDefault();  // Prevent form submission if inside a form
  
    // Check if searchText is empty
    if (!category) {
      console.error("Search text cannot be empty");
      return; // Exit early if no search text
    }
  
    fetch("/api/filter_category/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ category: category }),
    })
      .then((response) => {
        if (!response.ok) {
          // Handle non-200 responses
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        
        return response.json();
      })
      .then((data) => {
        navigate("/events-search/", { state: { events: data, valueCat: category } });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleClear = () => {
    setCategory(""); 
    navigate("/events");
  };

  console.log("this", valueCat)
  console.log(events)
  
  
    
      return (
        <div className="flex flex-col min-h-screen">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6 px-4">
            <div className="relative inline-block">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {category ? category : "Select Category"}
              </button>
              {isOpen && (
                <div className="absolute left-0 mt-2 w-40 bg-white shadow-lg rounded-md z-20">
                  {options.map((option, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                      onClick={() => {
                        filterCategoryEvents(option);
                        setIsOpen(false);
                      }}
                    >
                      {option}
                      {category === option && <span className="text-blue-500 font-bold">✓</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
    
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Clear
            </button>
    
            <div className="relative w-full max-w-xl">
              <form onSubmit={filterEvents} className="flex">
                <input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full bg-white text-gray-900 border border-gray-300 rounded-l-lg pl-3 py-3 focus:outline-none focus:border-gray-500"
                  placeholder="Search events..."
                />
                <button className="bg-[#6d6fff] text-white px-6 rounded-r-lg hover:scale-110" type="submit">
                  Search
                </button>
              </form>
            </div>
          </div>
    
          <h1 className="text-center text-4xl font-bold text-black mt-4">All Matching Events</h1>
    
          <div className="px-6 mt-6">
            {events?.length > 0 ? (
              <div className="grid lg:grid-cols-4 gap-6 container mx-auto">
                {currentEvents.map((event) => (
                  <EventItem key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center">
                <p className="text-xl font-bold text-gray-600">EVENTS COMING...</p>
              </div>
            )}
          </div>
    
          <div className={`w-full flex justify-center mb-6 ${isMobile ? 'flex-col items-center' : ''}`}>
            <div className="w-full max-w-2xl z-10">
              {!isMobile && events?.length > 0 && (
                <div className="flex-shrink-0 w-1/6">
                  <Pagination
                    eventsPerPage={eventsPerPage}
                    totalEvents={events.length}
                    paginate={paginate}
                    currentPage={currentPage}
                  />
                </div>
              )}
              {isMobile && events?.length > 0 && (
                <div className="mt-6 mb-6">
                  <Pagination
                    eventsPerPage={eventsPerPage}
                    totalEvents={events.length}
                    paginate={paginate}
                    currentPage={currentPage}
                  />
                </div>
              )}
            </div>
          </div>
    
          <Footer />
        </div>
      );
    };
    

export default EventsFiltered;