import { useState, useEffect, useContext } from "react";
import CloseIcon from "./CloseIcon";
import { Link, useNavigate } from "react-router-dom";
import ava from "../assets/img/ava.svg"; 
import { AuthContext } from '../context/AuthContext';

const FollowersModal = ({ closeModal, users, title }) => {
  const { authTokens } = useContext(AuthContext);

  const [filteredUsers, setFilteredUsers] = useState(users || []);
  const [search, setSearch] = useState("");
  const [profiles, setProfiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (users && users.length > 0) {
      getProfiles();
    }
  }, [users]);

  useEffect(() => {
    console.log("Profiles updated:", profiles);
  }, [profiles]);

  const getProfiles = async () => {
    try {
      const profileData = await Promise.all(
        users.map(async (user) => {
          const response = await fetch(`/api/profile/${user}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authTokens.access}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch profile for user ${user}`);
          }

          const data = await response.json();
          console.log(`Profile for user ${user}:`, data); 
          return data;
        })
      );

      setProfiles(profileData);
      setFilteredUsers(profileData);  // Initially, show all profiles
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  const getSelectedUser = async (userId) => {
    try {    
      const response = await fetch(`/api/user_by_id/${userId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const data = await response.json();
      console.log("Selected user data:", data);
      navigate(`/profile/`, { state: { user: data } });
      closeModal();

    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);

    // Filter the profiles array based on the search input
    const filtered = profiles.filter((profile) => 
      profile.user.username.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  return (
    <div className="relative z-10" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-opacity-80 transition-all backdrop-blur-sm"></div>
      <div className="fixed inset-0 z-10 flex justify-center pt-12 pb-12">
        <div className="relative w-[90%] sm:w-[40%] min-h-[60vh] ring-2 ring-black rounded-2xl bg-white text-left shadow-xl transition-all overflow-auto">
          <div className="px-5 py-5">
            <h1 className="text-center text-xl font-bold">{title}</h1>

            <div className="border-b-2 py-4 px-2">
              <input
                type="text"
                placeholder="Search users"
                className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full text-black"
                value={search}
                onChange={handleSearch}
              />
            </div>

            {/* Users List */}
            <div className="mt-4">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((profile) => (
                  <div 
                    key={profile.id} 
                    onClick={() => getSelectedUser(profile.user.id)} 
                    className="cursor-pointer flex items-center gap-3 p-2 hover:bg-gray-100 transition"
                  >
                    <img src={profile.avatar || ava} className="w-10 h-10 rounded-full" alt="User Avatar" />
                    <span className="truncate font-medium">{profile?.user?.username}</span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No users found</p>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={closeModal}
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

export default FollowersModal;
