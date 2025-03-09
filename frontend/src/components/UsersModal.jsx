import { useEffect, useState, useContext } from "react";
import CloseIcon from "./CloseIcon";
import ava from "../assets/img/ava.svg";  // Import your default avatar image
import { AuthContext } from '../context/AuthContext'
import { Link } from "react-router-dom";

const UsersModal = ({ closeModal, eventID}) => {
  const [users, setUsers] = useState([])
  const [event, setEvent] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [avatars, setAvatars] = useState({});  
  const {authTokens} = useContext(AuthContext)

  useEffect(() => {
    allUsers();
  }, [eventID]);


  const allUsers = async () => {
    const response = await fetch(`/api/events-detail/${eventID}/`);
    if (response.ok) {
      const data = await response.json()
      setEvent(data)
      setUsers(data.participants)
      setFilteredUsers(data.participants)
      await loadAvatars(data.participants)
    }
  }

  // Fetch all user avatars and store them
  const loadAvatars = async (users) => {
    const avatars = {};
    for (const user of users) {
      const avatar = await profilePic(user.id);
      avatars[user.id] = avatar || ava;  // Set avatar or fallback to default
    }
    setAvatars(avatars);  // Update state with all avatars
  };

  // Fetch user profile picture
  const profilePic = async (userId) => {
    const response = await fetch(`/api/profile/${userId}/`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authTokens.access),
      }
    }
    );
    if (response.ok) {
      const data = await response.json();
      return data.avatar;
    }
    return ''; 
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    setFilteredUsers(
      users.filter((user) =>
        user.username.toLowerCase().includes(query)
      )
    );
  };

  return (
    <div className="relative z-10" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-opacity-80 transition-all backdrop-blur-sm"></div>
      <div className="fixed inset-0 z-10 flex justify-center pt-12 pb-12">
        <div className="relative w-[40%] sm:w-[40%] min-h-[60vh] ring-2 ring-black rounded-2xl bg-white text-left shadow-xl transition-all overflow-auto">

          <div className="px-5 py-5">
          <h1 className="text-center text-xl font-bold">Users Joined </h1>
            <div className="border-b-2 py-4 px-2">
              
              <input
                type="text"
                placeholder="Search users"
                className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full text-black"
                value={search}
                onChange={handleSearch}
              />
            </div>

            {/* Users/Filtered Users */}
            <div className="mt-4">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <Link to="/profile" state={{ user: user }}>
                  <div
                    key={user.username}
                    className="truncate flex-1 flex items-center gap-3 p-2 hover:bg-customBlue-100 transition"
                  >
                    {/* Display user avatar with fallback */}

                    <img
                      src={avatars[user.id] || ava}  // Fallback to `ava` if no avatar
                      className="w-10 h-10 rounded-full ring-1 ring-black"
                      loading="lazy"
                      alt={`${user.username} avatar`}
                    />
                    {event.host.username === user.username ? (
                    <div className="flex flex-row gap-2 items-center justify-between  overflow-hidden whitespace-nowrap">
                      <span className="font-medium text-lg truncate  ">{user.username}</span>
                      <span className="text-xs text-white bg-[#6d6fff] w-[45px] px-2 py-1 rounded-full">Host</span>
                    </div>
                    ) : (
                      <span className="font-medium text-lg truncate   ">{ user.username}</span>
                    )}

                  </div>
                  </Link>
                ))
              ) : (
                <p className="text-center text-gray-500">No users found</p>
              )}
            </div>

            <button
              onClick={closeModal}
              type="button"
              className="rounded-md p-1 inline-flex items-center justify-center text-gray-400 hover:bg-gray-700 focus:outline-none absolute top-2 right-2"
            >
              <span className="sr-only">Close menu</span>
              <CloseIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersModal;
