import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import CreateEventPage from "./CreateEventPage";
import { AuthContext } from "../context/AuthContext";
import Join from "../components/Join";
import UsersModal from '../components/UsersModal';

const EventPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [modal, setModal] = useState(false)
  
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

      // Check if the current user is in the participants list
      if (data?.participants?.some((participant) => participant.id === user?.user_id)) {
        setHasJoined(true);
      }
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

  const handleJoinSuccess = () => {
    setHasJoined(true); // Update the state when the user successfully joins
  };

  return (
    <div className="min-h-screen text-gray-900 flex flex-col items-center py-12 px-6">
      <h1 className="flex justify-center text-4xl font-bold text-black mb-10 mt-[-50px]">Event Overview</h1>
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
          <div className="mt-8 max-w-3xl text-center">
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
          className="text-customBlue-600 hover:underline text-md font-semibold ml-2 cursor-pointer"
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
                  <button onClick={() => setModal(true)} className="w-full bg-[#6d6fff] text-white py-2 rounded-lg text-lg font-semibold shadow-lg hover:bg-gray-800 transition duration-300">
                See All Users
              </button>
              
                  <button
                    className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                    onClick={handleDelete}
                  >
                    🗑 Delete
                  </button>
                  

              {modal && <UsersModal closeModal={() => setModal(false)} eventID={event?.id} />}
                </div>
              
              ) : (
                
                <div className="mt-[-20px] font-bold ">
                  
                  <Join eventId={id} onJoinSuccess={handleJoinSuccess} className="font-bold "/>
                  <button onClick={() => setModal(true)} className="bg-[#6d6fff] text-white py-5 px-6 mt-2 rounded-lg text-lg font-semibold shadow-lg hover:bg-gray-800 transition duration-300">
                See All Users
              </button>
              {modal && <UsersModal closeModal={() => setModal(false)} eventID={event?.id} />}
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
