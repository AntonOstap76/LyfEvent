import React, { useContext } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';

const EventItem = ({ event }) => {
  const navigate = useNavigate();
  const { authTokens, user } = useContext(AuthContext); // Access authTokens and user from context

  // Check if the user is logged in based on authTokens
  const isLoggedIn = !!authTokens;

  // Format date to "9 March 2025"
  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "TBD";


  return (
    <div className="relative">

      <Link to={user ? `/event/${event.id}` : "/login"}
      >
        <div className="bg-gray-20 border border-gray-200 rounded-lg shadow border-black-700 transform hover:scale-105 transition-transform duration-300">

      {/* Conditional "FOR STUDENTS" label */}
      {event?.for_students && (
        <div className="absolute top-2 left-2 bg-customBlue-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow z-20">
          FOR STUDENTS
        </div>
      )}
          {/* Image */}
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}> {/* 16:9 ratio */}
            <img
              className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg"
              src={event?.image}
              alt={event?.title || "Event image"}
            />
          </div>

          {/* Event details */}
          <div className="px-5 pb-2">
            {/* Title */}
            <h5 className="truncate flex-1 text-xl font-semibold tracking-tight text-gray-900">
              {event?.title}
            </h5>

            {/* Description & Category */}
            <div className="flex items-center mt-2 text-md text-gray-700">
              <p className="truncate flex-1">{event?.description}</p>
              <span className="text-gray-400 mx-4">|</span>
              <p className="text-customBlue-600 text-sm font-medium whitespace-nowrap">
                Type: {event?.category || "Uncategorized"}
              </p>
            </div>

            {/* Date and Location */}
            <p><strong>Date:</strong> {formattedDate}</p>
            <p><strong>Location:</strong> {event?.location || "Unknown"}</p>

            {/* Attendees */}
            <p className="text-black-700">
              <strong>Joined:</strong> {event?.participants?.length || 0} / {event?.capacity || "Unlimited"}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EventItem;
