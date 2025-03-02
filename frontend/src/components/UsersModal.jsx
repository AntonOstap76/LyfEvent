import { useEffect, useState } from "react";
import CloseIcon from "./CloseIcon";

const UsersModal = ({closeModal, eventID}) => {

  const [users, setUsers]= useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [search, setSearch] = useState("");

  useEffect(()=>{
    allUsers()
  }, [eventID])



  const allUsers = async () => {
    const response = await fetch(`/api/events-detail/${eventID}/`);
    if (response.ok) {
      const data = await response.json();
      setUsers(data.participants);
      setFilteredUsers(data.participants)
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    setFilteredUsers(users.filter((user) => user.username.toLowerCase().includes(query)));
  };
  

  return (
    <div
      className="relative z-10"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-opacity-80 transition-all backdrop-blur-sm">
        
      </div>
      <div className="fixed inset-0 z-10 flex justify-center pt-12 pb-12">
        <div className="relative w-[60%] sm:w-[50%] min-h-[60vh] ring-2 ring-black rounded-2xl bg-white  text-left shadow-xl transition-all
         overflow-auto"> 
          <div className="px-5 py-5">

          <div className="border-b-2 py-4 px-2">
              <input
                type="text"
                placeholder="Search users"
                className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full text-black"
                value={search}
                onChange={handleSearch} 
              />
            </div>

            {/* Users/Filtered Users*/}
            <div className="mt-4">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div key={user.username} 
                  className="truncate flex-1 flex items-center gap-3 p-2 hover:bg-customBlue-100 transition" >
                    <img src="" className="w-10 h-10 rounded-full" alt="User" />
                    
                    <span className="truncate flex-1 font-medium">{user.username}</span>
                  </div>
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