import React, { useState, useEffect, useContext } from 'react';
import EventItem from '../components/EventItem';
import { AuthContext } from '../context/AuthContext';

const EventsPage = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [filteredJoinedEvents, setFilteredJoinedEvents] = useState([]); // ✅ Avoids infinite re-renders
  const [activeTab, setActiveTab] = useState('Created');
  const { authTokens, user } = useContext(AuthContext);

  useEffect(() => {
    getMyEvents();
    getJoinedEvents();
  }, [authTokens]);

  const getMyEvents = async () => {
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

  const getJoinedEvents = async () => {
    const userId = user.user_id;
    try {
      const response = await fetch(`/api/joined-events/${userId}`, {
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
      setJoinedEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error.message);
    }
  };

  // ✅ Separate filtered state to prevent infinite loop
  useEffect(() => {
    if (myEvents.length > 0 && joinedEvents.length > 0) {
      const filtered = joinedEvents.filter(
        (event) => !myEvents.some((myEvent) => myEvent.id === event.id)
      );
      setFilteredJoinedEvents(filtered);
    
    }
    if (joinedEvents &&  myEvents.length === 0) { setFilteredJoinedEvents(joinedEvents)}
    
  }, [myEvents, joinedEvents]); // Only runs when either changes

  return (
    <div className="flex flex-col min-h-screen mb-4">
      <h1 className="flex justify-center text-4xl font-bold text-black mb-12">
        My Events
      </h1>

      {/* Toggle Button */}
      <div className="flex justify-center mb-8">
        <div className="relative flex space-x-12 text-lg font-semibold">
          <button
            className={`relative pb-2 transition duration-300 ${
              activeTab === 'Created' ? 'text-black' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('Created')}
          >
            Created
            {activeTab === 'Created' && (
              <div className="absolute left-0 bottom-0 w-full h-1 bg-black transition-all duration-300"></div>
            )}
          </button>
          <button
            className={`relative pb-2 transition duration-300 ${
              activeTab === 'Joined' ? 'text-black' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('Joined')}
          >
            Joined
            {activeTab === 'Joined' && (
              <div className="absolute left-0 bottom-0 w-full h-1 bg-black transition-all duration-300"></div>
            )}
          </button>
        </div>
      </div>

      {/* Event List */}
      {activeTab === 'Created' && (
        <div>
          {myEvents.length > 0 ? (
            <div className="grid lg:grid-cols-4 gap-8 px-6 container mx-auto">
              {myEvents.map((event) => (
                <EventItem key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center mx-auto relative">
              <p className="text-xl text-center font-bold text-gray-600">
                You've not created any events yet...
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'Joined' && (
        <div>
          {filteredJoinedEvents.length > 0 ? (
            <div className="grid lg:grid-cols-4 gap-8 px-6 container mx-auto">
              {filteredJoinedEvents.map((event) => (
                <EventItem key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center mx-auto relative">
              <p className="text-xl text-center font-bold text-gray-600">
                You haven't joined any events yet...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
