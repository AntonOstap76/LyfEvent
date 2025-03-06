import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import CreateEventPage from "./CreateEventPage";
import { AuthContext } from "../context/AuthContext";
import Join from "../components/Join";


const EventPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    getEvent();
  }, [id]);

  const getEvent = async () => {
    try {
      const response = await fetch(`/api/events-detail/${id}/`);
      if (!response.ok) {
        throw new Error("Failed to fetch event details.");
      }
      const data = await response.json();
      setEvent(data);
    } catch (error) {
      console.error("Error fetching event:", error.message);
    }
  };

  const handleEdit = () => setEditOpen(true);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/events-delete/${id}/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) navigate("/my-events");
      else throw new Error("Failed to delete the event.");
    } catch (error) {
      console.error("Error deleting event:", error.message);
    }
  };

console.log(event?.host)

  return (
    <div className="min-h-screen  text-gray-900 flex flex-col items-center pb-12 px-6">
      <h1 className='flex justify-center text-4xl font-bold text-black mb-6'>Event Overview</h1>
      {editOpen ? (
        <CreateEventPage eventId={id} />
      ) : (
        <>
          {/* Image Container */}
          <div className="w-full max-w-2xl">
            <img
              className="w-full h-80 object-cover rounded-lg shadow-lg"
              src={event?.image || "/placeholder-image.jpg"}
              alt="Event"
            />
          </div>

          {/* Event Details */}
          <div className="mt-8 max-w-3xl text-center max-w break-words overflow-hidden">
            {/* Event Title */}
            <h1 className="text-4xl font-extrabold mb-4">{event?.title}</h1>

            {/* Description */}
            <p className="text-lg text-gray-700 leading-relaxed mb-6 max-w break-words overflow-hidden">
            {event?.description}
            </p>

            {/* Event Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg text-gray-800 text-center">
  {event?.category && (
    <p>
      <span className="font-semibold">📌 Category:</span> {event?.category}
    </p>
  )}
  {event?.location && (
    <p>
      <span className="font-semibold">📍 Location:</span> {event?.location}
    </p>
    
  )}
  
  {event?.date && (
    <>
      <p>
        <span className="font-semibold">📅 Date:</span>{" "}
        {new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(new Date(event.date))}
      </p>
      <p>
        <span className="font-semibold">⏰ Time:</span>{" "}
        {new Intl.DateTimeFormat("en-US", { timeStyle: "short" }).format(new Date(event.date))}
      </p>
    </>
  )}
  
  {event?.participants &&(
    <p>
      <strong className="font-semibold">👥 Joined: </strong>{event?.participants.length || 0} / {event?.capacity}
    </p>
  )}
  {/* Centered "Hosted by" Section */}
  {event?.host && (

      <p className="truncate flex-1 text-lg text-gray-700 font-semibold">
      👤 Hosted by:
        <span 
          className="text-customBlue-600 hover:underline font-medium ml-2 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/profile/`, { state: { user: event?.host } });
          }}
        >
          {event?.host.username}
        </span>
      </p>

  )}
</div>

            {/* Action Buttons */}
<div className="mt-4 flex justify-center gap-4">
  {user?.user_id === event?.host.id ? (
    <div className="flex gap-4">
      <button
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        onClick={handleEdit}
      >
        ✏️ Edit
      </button>
      <button
        className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
        onClick={handleDelete}
      >
        🗑 Delete
      </button>

    </div>
  ) : (
    <div className="mt-[-20px] ">
      <Join eventId={id} />
    </div>
  )}
</div>


          </div>
        </>
      )}
    </div>
  );
};

export default EventPage;
