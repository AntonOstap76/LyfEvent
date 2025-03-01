import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";

const Join = ({ eventId }) => {
  const [joined, setJoined] = useState(false);
  const { authTokens, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    checkJoined();
  }, [eventId]); // Remove `joined` from dependency array to avoid unnecessary checks

  const checkJoined = async () => {
    try {
      const response = await fetch(`/api/events-detail/${eventId}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch event details.');
      }
      const data = await response.json();
      
      // Check if user is already in participants
      const isUserJoined = data.participants.some(participant => participant.id === user.user_id);
      
      setJoined(isUserJoined);
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
      const response = await fetch(`/api/events-join/${eventId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.access}`,
        },
      });

      if (response.ok) {
        setJoined(true); // Successfully joined the event
      }
    } catch (error) {
      console.error("Error joining the event:", error);
    }
  };

  const handleLeave = async () => {
    try {
      const response = await fetch(`/api/events-leave/${eventId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.access}`,
        },
      });

      if (response.ok) {
        setJoined(false); // Successfully left the event
      }
    } catch (error) {
      console.error("Error leaving the event:", error);
    }
  };

  const handleGoToChat = () => {
    // Replace '/chat/{eventId}' with the correct path to your chat page
    navigate(`/chat/${eventId}`);
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
            className="px-6 py-3.5 font-semibold rounded-md shadow bg-red-600 text-white hover:bg-red-800"
          >
            Leave
          </button>

          {/* Show "Go to Chat" button after joining */}
          <button
            onClick={handleGoToChat} // Redirect to the chat
            className="mt-4 px-6 py-3.5 font-semibold rounded-md shadow bg-blue-600 text-white hover:bg-blue-800"
          >
            Go to Chat
          </button>
        </div>
      ) : (
        <div className="mt-8">
          <p className="text-lg font-medium text-gray-700 mb-4">
            Join if you plan on participating in this event.
          </p>
          <button
            onClick={handleJoin} // Trigger join event
            className="px-6 py-3.5 font-semibold rounded-md shadow bg-green-600 text-white hover:bg-green-800"
          >
            Join
          </button>
        </div>
      )}
    </div>
  );
};

export default Join;
