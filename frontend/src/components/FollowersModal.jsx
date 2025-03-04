import { useState } from "react";
import CloseIcon from "./CloseIcon";
import { Link } from "react-router-dom";
import ava from "../assets/img/ava.svg"; 
const FollowersModal = ({ closeModal, users, title }) => {
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [search, setSearch] = useState("");

  
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    setFilteredUsers(users.filter((user) => user.username.toLowerCase().includes(query)));
  };
  console.log("Users in Modal:", users);
  return (
    <div className="relative z-10" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-opacity-80 transition-all backdrop-blur-sm"></div>
      <div className="fixed inset-0 z-10 flex justify-center pt-12 pb-12">
        <div className="relative w-[60%] sm:w-[50%] min-h-[60vh] ring-2 ring-black rounded-2xl bg-white text-left shadow-xl transition-all overflow-auto">
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
                filteredUsers.map((user) => (
                  <Link key={user.id} to={`/profile/${user.id}`}>
                    <div className="flex items-center gap-3 p-2 hover:bg-gray-100 transition">
                      <img src={ava} className="w-10 h-10 rounded-full" alt="User Avatar" />
                      <span className="truncate font-medium">{user.username}</span>
                    </div>
                  </Link>
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
