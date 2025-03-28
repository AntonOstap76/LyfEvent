import React, { useContext} from 'react';
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { FaInfoCircle } from "react-icons/fa";
import { FaStar } from "react-icons/fa"; // Add the star icon for host

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
      <Link to={user ? `/event/${event.id}` : "/login"}>
        <div className="relative border border-gray-200 rounded-2xl shadow-xl border-black-700 transform hover:scale-105 transition-shadow duration-300 shadow-md bg-white">

          {/* Conditional "FOR STUDENTS" label */}
          {event?.for_students && (
            <div>
              <div 
                data-tooltip-id={`student-tooltip-${event.id}`}
                className="absolute top-2 left-2 bg-[#6d6fff] text-white text-xs font-semibold px-2 py-1 rounded-md shadow z-20 cursor-pointer flex items-center space-x-2"
              >
                <span>FOR STUDENTS</span>
                <FaInfoCircle className="text-white text-sm" />
              </div>

              {/* Tooltip */}
              <Tooltip
                id={`student-tooltip-${event.id}`}  // Ensure the ID is unique for each event
                place="top"
                content="Requires a university email to join."
                style={{ backgroundColor: "#5a5ae6", color: "white", fontWeight: "600" }}
              />
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
          
          {/* Show a star icon if the user is the host of the event */}
          {user && event.host.id === user.user_id && (
            <div className="absolute top-2 right-2 text-yellow-500 z-30">
              
              <span className="text-xs text-center text-white bg-[#6d6fff] w-[45px] px-2 py-1 rounded-md font-semibold">
                HOST
              </span>
            </div>

          )}
          
        </div>
      </Link>
    </div>
  );
};

export default EventItem;
