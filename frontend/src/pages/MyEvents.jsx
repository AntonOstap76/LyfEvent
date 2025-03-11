import React, { useState, useEffect, useContext } from 'react';
import EventItem from '../components/EventItem';
import { AuthContext } from '../context/AuthContext';

const EventsPage = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(8);
  const { authTokens } = useContext(AuthContext);

  useEffect(() => {
    getEvents();
  }, [authTokens]);

  const getEvents = async () => {
    try {
      const response = await fetch('/api/my-events/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(authTokens.access),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setMyEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error.message);
    }
  };

  // Pagination Logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = myEvents.slice(indexOfFirstEvent, indexOfLastEvent);

 

  return (
    <div className="flex flex-col min-h-screen">
      <h1 className='flex justify-center text-4xl font-bold text-black mb-6'>My Events</h1>
      {/* Content Wrapper */}
      <div>
        {myEvents.length > 0 ? (
          <div className="grid lg:grid-cols-4 gap-8 px-6 container mx-auto">
            {currentEvents.map((event) => (
              <EventItem key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl font-bold text-gray-600">You've not created any events yet...</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default EventsPage;
