import React, { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import ava from '../assets/img/ava.svg';
import { useNavigate, Link } from 'react-router-dom';

const ChatMessage = ({ content, authorName }) => {
  const { user, authTokens } = useContext(AuthContext);
  const [authorData, setAuthorData] = useState(null);
  const fetchedUsers = useRef({}); // Cache fetched user data

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authorName || fetchedUsers.current[authorName]) {
        setAuthorData(fetchedUsers.current[authorName]);
        return;
      }

      try {
        const userResponse = await fetch(`/api/user_by_username/${authorName}`);
        if (!userResponse.ok) throw new Error('Failed to fetch user');
        const userData = await userResponse.json();

        const profileResponse = await fetch(`/api/profile/${userData.id}/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authTokens.access}`,
          },
        });
        
        const profileData = profileResponse.ok ? await profileResponse.json() : {};

        const combinedData = { ...userData, avatar: profileData.avatar || ava };
        fetchedUsers.current[authorName] = combinedData; // Cache fetched data
        setAuthorData(combinedData);
      } catch (error) {
        console.error('Error fetching user or profile:', error);
      }
    };

    fetchUserData();
  }, [authorName, authTokens.access]);

  return (
    <div>
      {authorName === user.username ? (
        <li className="flex justify-end items-end mb-4">
          <div className="bg-customBlue-200 p-4 rounded chat-bubble max-w-xs break-words whitespace-normal">
            <span>{content}</span>
          </div>
          <Link to="/my-profile">
            <img src={authorData?.avatar || ava} className="w-8 h-8 rounded-full ring-1 ring-black ml-2 mb-3" alt="User" />
          </Link>
        </li>
      ) : (
        <li className="flex justify-start mb-4 items-center gap-2">
          <Link to="/profile" state={{ user: authorData }}>
            <img src={authorData?.avatar || ava} className="w-8 h-8 rounded-full ring-1 ring-black cursor-pointer" alt="Author Avatar" />
          </Link>
          <div className="bg-gray-200 p-4 rounded chat-bubble max-w-xs break-words whitespace-normal">
            <span className="truncate flex-1 block text-md font-medium text-customBlue-400 mb-2">
              {authorName}
            </span>
            <span>{content}</span>
          </div>
        </li>
      )}
    </div>
  );
};

export default ChatMessage;