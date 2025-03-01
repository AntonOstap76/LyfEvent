import React from 'react';
import { Link, useNavigate } from "react-router-dom";

const EventItem = ({ event }) => {
  const navigate = useNavigate(); // ✅ Hook for navigation

  // Format date to "9 March 2025"
  const formattedDate = event.date 
    ? new Date(event.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) 
    : "TBD";

  return (
    <Link to={`/event/${event.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg shadow border-black-700 transform hover:scale-105 transition-transform duration-300">
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

          {/* Host (Clickable) */}
          {event.host && (
            <p className="mt-1 text-sm text-gray-600">
              Hosted by:  
              <span 
                className="text-blue-600 hover:underline font-medium ml-1 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault(); // ✅ Prevents Link from opening the event
                  navigate(`/profile/`, { state: { user: event.host } });
                }}
              >
                {event.host.username}
              </span>
            </p>
          )}

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
        </div>
      </div>
    </Link>
  );
};

export default EventItem;
