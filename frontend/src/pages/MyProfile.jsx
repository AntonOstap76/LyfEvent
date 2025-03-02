import React, { useContext, useState, useEffect} from 'react';
import { AuthContext } from '../context/AuthContext';
import JoinedModal from '../components/JoinedModal'
import ava from '../assets/img/ava.svg';

const MyProfile = () => {

  const { user, logoutUser, authTokens} = useContext(AuthContext);
  const [modalJoined, setModalJoined] = useState(false)
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [data, setData] = useState([])
  const [edit, setEdit] = useState(false)


  useEffect(()=>{
    getProfileData()

  }, [user])

  
  const getProfileData = async () => {
    const userId = user.user_id;
  
    try {
      const response = await fetch(`/api/profile/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(authTokens.access),
        },
      });
  
      if (!response.ok) {
        return;
      }
  
      const data = await response.json();
      setData(data);
      console.log(data)

    } catch (error) {
      console.error('Error fetching profile data:', error.message);
    }
  };
  

  const getJoinedEvents = async () => {
    const userId = user.user_id
    try {
      const response = await fetch(`/api/joined-events/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(authTokens.access),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      setJoinedEvents(data);
      setModalJoined(true)
    } catch (error) {
      console.error('Error fetching events:', error.message);
    }
  };


  const editActivate = ()=>{
    setEdit(true)

  }



  return (
    <div className="min-h-screen flex flex-col items-center relative">
      {user ? (
        edit ? (
          
          <div className="w-3/6 rounded-lg text-gray-900 bg-white px-6 pb-8 shadow-xl relative">
        
            <div className="absolute inset-0 w-full h-full bg-white/30 rounded-lg z-0"></div>
  
            {/* Banner (Exempt from Blur) */}
            <div className="rounded-lg ring-1 ring-black h-32 overflow-hidden bg-customBlue-500 relative z-10"></div>
  
            {/* Avatar (Exempt from Blur) */}
            <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden bg-gray-200 z-10">
              <img src={ava} alt="" />
            </div>
  
        {/* Username (Exempt from Blur) */}
        <div className="text-center mt-2 relative z-10">
          <h2 className="font-semibold">{user.username}</h2>
        </div>
  
  
            {/* Facts Section (Exempt from Blur) */}
            <div className="h-[24vh] w-full flex justify-between gap-3 mt-6 relative z-10">
              {[1, 2, 3].map((fact) => (
                <div
                  key={fact}
                  className="w-1/3 shadow-xl border bg-customBlue-100 rounded-xl h-full p-4 flex flex-col"
                >
                  <h1 className="text-center text-lg font-bold">Fact {fact}</h1>
                  <hr className="my-2 mx-4 border-gray-300" />
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="w-full h-4 bg-gray-300 rounded"></div>
                    <div className="w-5/6 h-4 bg-gray-300 rounded"></div>
                    <div className="w-4/6 h-4 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
  
            {/* Edit & Logout Buttons */}
            <div className="flex justify-center items-center mt-8 relative z-10">
              <div className="flex flex-row justify-around w-full">
                <button
                  onClick={() => setEdit(!edit)}
                  className="w-2/6 bg-customBlue-500 text-white py-2 rounded-lg hover:bg-customBlue-600 transition"
                >
                  {edit ? "Save" : "Edit Profile"}
                </button>
                <button
                  onClick={logoutUser}
                  className="w-2/6 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            </div>
  
            {/* Modal */}
            {modalJoined && <JoinedModal closeModal={() => setModalJoined(false)} events={joinedEvents} />}
          </div>

        ) : (
          <div className="w-3/6 rounded-lg text-gray-900 bg-white px-6 pb-8 shadow-xl relative">
            {/* Background Blur Effect (applies only to the content inside) */}
            <div className="absolute inset-0 w-full h-full bg-white/30 rounded-lg z-0"></div>
  
            {/* Banner (Exempt from Blur) */}
            <div className="rounded-lg ring-1 ring-black h-32 overflow-hidden bg-customBlue-500 relative z-10"></div>
  
            {/* Avatar (Exempt from Blur) */}
            <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden bg-gray-200 z-10">
              <img src={ava} alt="" />
            </div>
  
            {/* Username (Exempt from Blur) */}
            <div className="truncate flex-1 text-center mt-2 relative z-10">
              <h2 className="font-semibold">{user.username}</h2>
            </div>
  
            {/* Blur Wrapper (Everything Else) */}
            <div className={`relative ${edit ? "blur-md" : ""} transition-all duration-300 z-0`}>
              {/* Follow Section */}
              <ul className="py-4 mt-2 text-gray-700 flex items-center justify-around">
                <button>
                  <li className="flex flex-col items-center text-lg">
                    Followers
                    <span>{data?.followers?.length ?? 0}</span>
                  </li>
                </button>
                <button>
                  <li className="flex flex-col items-center text-lg">
                    Following
                    <span>{data?.following?.length ?? 0}</span>
                  </li>
                </button>
              </ul>
  
              {/* Buttons */}
              <div className="flex justify-center mt-4">
                <button
                  onClick={getJoinedEvents}
                  className="p-2 ring-2 ring-black rounded-xl text-black text-xl font-bold w-2/6 flex items-center justify-center hover:scale-110 transition"
                >
                  Joined Events
                </button>
              </div>
            </div>
  
            {/* Facts Section (Exempt from Blur) */}
            <div className="h-[24vh] w-full flex justify-between gap-3 mt-6 relative z-10">
              {[1, 2, 3].map((fact) => (
                <div
                  key={fact}
                  className="w-1/3 shadow-xl border bg-customBlue-100 rounded-xl h-full p-4 flex flex-col"
                >
                  <h1 className="text-center text-lg font-bold">Fact {fact}</h1>
                  <hr className="my-2 mx-4 border-gray-300" />
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="w-full h-4 bg-gray-300 rounded"></div>
                    <div className="w-5/6 h-4 bg-gray-300 rounded"></div>
                    <div className="w-4/6 h-4 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
  
            {/* Edit & Logout Buttons */}
            <div className="flex justify-center items-center mt-8 relative z-10">
              <div className="flex flex-row justify-around w-full">
                <button
                  onClick={() => setEdit(!edit)}
                  className="w-2/6 bg-customBlue-500 text-white py-2 rounded-lg hover:bg-customBlue-600 transition"
                >
                  {edit ? "Save" : "Edit Profile"}
                </button>
                <button
                  onClick={logoutUser}
                  className="w-2/6 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            </div>
  
            {/* Modal */}
            {modalJoined && <JoinedModal closeModal={() => setModalJoined(false)} events={joinedEvents} />}
          </div>
        )
      ) : null}
    </div>
  );
  
  
  
  
  
};

export default MyProfile;
