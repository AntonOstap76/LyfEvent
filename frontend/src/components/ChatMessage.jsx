import React, { useContext,  } from 'react'
import { AuthContext } from '../context/AuthContext';
import ava from '../assets/img/ava.svg';

const ChatMessage = ({ content, authorName}) => {
    let {user} = useContext(AuthContext)
    
    
     

  return (
        <div>
            {authorName===user.username ? (
                
                <li className="flex justify-end items-end mb-4">
  {/* Message Bubble */}
  
  <div 
  key={user.username} 
  onClick={() => navigate('/profile', { state: { user } })}
  className="bg-blue-200 p-4 rounded chat-bubble max-w-xs break-words whitespace-normal " >
    
    <span className="block text-sm font-medium text-black mb-1"></span> {/* Username */}
    <span>{content}</span> {/* Message */}
  </div>
  
  {/* Avatar on the Right */}
  <img src={ava} className="w-8 h-8 rounded-full ml-2 mb-3" alt="User" />
</li> ) : (            
                <li className="flex justify-start mb-4 items-center gap-2">
                <img src={ava} className="w-8 h-8 rounded-full" alt="Author Avatar" />
                <div className="bg-gray-200 p-4 rounded chat-bubble max-w-xs break-words">
    <span className="truncate flex-1 block text-sm font-medium text-black mb-1 break-words overflow-wrap break-word">{authorName}</span> {/* Username */}
    <span>{content}</span> {/* Message */}
  </div>
                
              </li>) }

    </div>
  )
}

export default ChatMessage