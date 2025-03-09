import React, { useContext, useState, useEffect} from 'react';
import { AuthContext } from '../context/AuthContext';
import JoinedModal from '../components/JoinedModal'
import ava from '../assets/img/ava.svg';
import { useLocation, useNavigate } from 'react-router-dom';

const Profile = () => {

  const { user, authTokens} = useContext(AuthContext);
  const [modalJoined, setModalJoined] = useState(false)
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [data, setData] = useState([])
  const { state } = useLocation()
  const userOther = state?.user
  const [following, setFollowing] = useState(false)
  const navigate = useNavigate()



  useEffect(()=>{
    getProfileData()

    if (userOther.id === user.user_id){
      navigate('/my-profile/')
    }


  }, [user, userOther, following])


  const getProfileData = async () => {
    const userId = userOther.id
  
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
      console.log(user.user_id)

      if (data.followers.includes(user.user_id)) {
        setFollowing(true);
      }
      console.log(following)
    } catch (error) {
      console.error('Error fetching profile data:', error.message);
    }
  };
  

 

  const getJoinedEvents = async () => {
    const userId = userOther.id
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


  const toggleFollow = async () => {
    const userId = userOther.id

    const endpoint = following ? `/api/unfollow/${userId}/` : `/api/follow/${userId}/`;
    try {
      const response = await fetch(endpoint , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(authTokens.access),
        },
      });

    const data = await response.json();
    console.log("Response:", data); // Log the API response

      if (!response.ok) {
        throw new Error('Failed to update follow status');
      }

      setFollowing(!following)


    } catch (error) {
      console.error('Error updating follow status:', error.message);
    }
  };


  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* <h1 className="flex justify-center text-4xl font-bold text-black">Profile</h1> */}

      {userOther && (
        <div className="w-full max-w-[920px] rounded-lg text-gray-900 bg-white px-4 sm:px-6 pb-8 shadow-xl relative ">
          <div className="rounded-lg h-32 overflow-hidden bg-customBlue-500">
      
          </div>
          <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden bg-gray-200">
            <img src={data.avatar || ava} alt="" />
          </div>

          <div className="text-center mt-2">
            <h2 className="truncate flex-1 font-semibold">{userOther.username}</h2>
          </div>

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

          <div className="flex justify-center mt-4">
            <button 
              onClick={getJoinedEvents}  
              className='p-2 ring-2 ring-black rounded-xl text-black text-xl font-bold w-2/6 flex items-center justify-center hover:scale-110 transition'>
              Joined Events
            </button>
          </div>

          {/* Facts */}
          <div className="h-[24vh] w-full flex justify-between gap-3 mt-6 relative z-10">
              {[1, 2, 3].map((fact) => (
                <div
                  key={fact}
                  className="w-1/3 shadow-xl border bg-customBlue-100 rounded-xl h-full p-4 flex flex-col"
                >
                  <h1 className="text-center text-lg font-bold">Fact {fact}</h1>
                  <hr className="my-2 mx-4 border-gray-300 " />
                  <div className="flex flex-col gap-2 mt-2">
                    {data[`fact${fact}`] ? (
                      <p className="text-center">{data[`fact${fact}`]}</p>
                    ) : (
                      <>
                        <div className="w-full h-4 bg-gray-300 rounded"></div>
                        <div className="w-5/6 h-4 bg-gray-300 rounded"></div>
                        <div className="w-4/6 h-4 bg-gray-300 rounded"></div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>


          <div className="flex justify-center items-center mt-8">
          <button
            onClick={toggleFollow}
            className={`w-2/6 py-2 rounded-lg text-white transition ${
              following ? 'bg-red-600 hover:bg-red-700' : 'bg-customBlue-500 hover:bg-customBlue-600'
            }`}
          >
            {following ? 'Unfollow' : 'Follow'}
          </button>
        </div>

          {modalJoined && <JoinedModal closeModal={() => setModalJoined(false)} events={joinedEvents} />}
          </div>
      )}
    </div>
  );
};

export default Profile;
