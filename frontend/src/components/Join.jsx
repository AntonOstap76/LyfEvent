import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import UsersModal from '../components/UsersModal';

const Join = ({ eventId }) => {
  const [joined, setJoined] = useState(false);
  const { authTokens, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [modal, setModal] = useState(false)

  useEffect(() => {
    checkJoined();
  }, [eventId]);

  const checkJoined = async () => {
    try {
      const response = await fetch(`/api/events-detail/${eventId}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch event details.');
      }
      const data = await response.json();
      setJoined(data.participants.some(participant => participant.id === user.user_id));
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  const handleJoin = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const eventData = await (await fetch(`/api/events-detail/${eventId}/`)).json();
      if (eventData.participants.length >= eventData.capacity) {
        Swal.fire({ title: "⚠️ Oops!", text: "The event is full.", icon: "error", confirmButtonColor: "#d33" });
        return;
      }
      const joinResponse = await fetch(`/api/events-join/${eventId}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authTokens.access}` },
      });
      if (joinResponse.ok) {
        setJoined(true);
        Swal.fire({ title: "🎉 Success!", text: "You have successfully joined the event.", icon: "success", confirmButtonColor: "#3085d6" });
      }
    } catch (error) {
      console.error("Error joining the event:", error);
      Swal.fire({ title: "⚠️ Oops!", text: "Something went wrong.", icon: "error", confirmButtonColor: "#d33" });
    }
  };

  const handleLeave = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You can rejoin anytime!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, leave it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/events-leave/${eventId}/`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${authTokens.access}` },
          });
          if (response.ok) {
            setJoined(false);
            Swal.fire({ title: "Left!", text: "You have successfully left the event.", icon: "success" });
          }
        } catch (error) {
          console.error("Error leaving the event:", error);
          Swal.fire({ title: "Error!", text: "Something went wrong.", icon: "error" });
        }
      }
    });
  };

  return (
    <div className="flex flex-col items-center mt-8 space-y-4">
      {joined ? (
        <>
          <p className="text-lg font-medium text-gray-700">You've already joined this event.</p>
          <div className="flex items-center space-x-4">

          <button onClick={() => setModal(true)} className="bg-[#6d6fff] text-white py-3 px-6 rounded-lg text-lg font-semibold shadow-lg hover:bg-gray-800 transition duration-300" 
          >
            
            See All Users
          </button>

          <Link
            to="/chat"
            state={{ eventId }}
          >
            <button className="bg-[#6d6fff] text-white py-3 px-6 rounded-lg text-lg font-semibold shadow-lg hover:bg-gray-800 transition duration-300">
            💬 Go to Chat

            </button>

          </Link>

        </div>
          <button
            onClick={handleLeave}
            className="px-7 py-3 text-lg font-semibold rounded-md shadow bg-red-600 text-white hover:bg-red-800"
          >
            Leave
          </button>

          {modal && <UsersModal closeModal={() => setModal(false)} eventID={eventId} />}
        </>

     

      ) : (
        <>
          <p className="text-lg font-medium text-gray-700">Join if you plan on participating in this event.</p>
          <button
            onClick={handleJoin}
            className="px-7 py-3 text-lg font-semibold rounded-md shadow bg-green-600 text-white hover:bg-green-800"
          >
            Join
          </button>
        </>
      )}
    </div>
  );
};

export default Join;