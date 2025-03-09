import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"

const Join = ({ eventId }) => {
  const [joined, setJoined] = useState(false);
  const { authTokens, user } = useContext(AuthContext);
  const navigate = useNavigate()

  useEffect(() => {
    checkJoined();
  }, [eventId, joined]); // Effect dependency should be `eventId` instead of `joined`

  const checkJoined = async () => {
    try {
      const response = await fetch(`/api/events-detail/${eventId}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch event details.');
      }
      const data = await response.json();
      
      // Check if user is already in participants
      const isUserJoined = data.participants.some(participant => participant.id === user.user_id);
      
      if (isUserJoined) {
        setJoined(true);
      } else {
        setJoined(false);
      }
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
      const response = await fetch(`/api/events-detail/${eventId}/`);
      if (!response.ok) {
        throw new Error("Failed to fetch event details.");
      }
  
      const eventData = await response.json();
  
      // Check if event is full
      if (eventData.participants.length >= eventData.capacity) {
        Swal.fire({
          title: "⚠️ Oops!",
          text: "The event is full.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
        return;
      }
  
      // Proceed with joining
      const joinResponse = await fetch(`/api/events-join/${eventId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
  
      if (joinResponse.ok) {
        setJoined(true);
        Swal.fire({
          title: "🎉 Success!",
          text: "You have successfully joined the event.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
      }
    } catch (error) {
      console.error("Error joining the event:", error);
      Swal.fire({
        title: "⚠️ Oops!",
        text: "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleLeave = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be able to revert this!",
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
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authTokens.access}`,
            },
          });
  
          if (response.ok) {
            setJoined(false);
            Swal.fire({
              title: "Left!",
              text: "You have successfully left the event.",
              icon: "success",
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: "Failed to leave the event. Please try again.",
              icon: "error",
            });
          }
        } catch (error) {
          console.error("Error leaving the event:", error);
          Swal.fire({
            title: "Error!",
            text: "Something went wrong. Please try again later.",
            icon: "error",
          });
        }
      }
    });
  };
  

  return (
    <div>
      {joined ? (
        <div className="mt-8">
        <p className="text-lg font-medium text-gray-700 mb-4">
          You've already joined this event.
        </p>
        <button
          onClick={handleLeave} // Trigger leave event
          className=" px-7 py-5 text-lg font-semibold rounded-md shadow bg-red-600 text-white hover:bg-red-800"
        >
          Leave
        </button>
        </div>
        
      ) : (
        <div className="mt-8">
        <p className="text-lg font-medium text-gray-700 mb-4">
          Join if you plan on participating in this event.
        </p>
        <button
          onClick={handleJoin} // Trigger join event
          className="px-7 py-5 text-lg font-semibold  rounded-md shadow bg-green-600 text-white hover:bg-green-800"
        >
          Join
        </button>
        </div>
      )}
    </div>
  );
};

export default Join;
