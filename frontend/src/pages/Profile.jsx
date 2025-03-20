import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import JoinedModal from '../components/JoinedModal';
import ava from '../assets/img/ava.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import FollowersModal from '../components/FollowersModal';

const Profile = () => {
  const { user, authTokens } = useContext(AuthContext);
  const [modalJoined, setModalJoined] = useState(false);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [data, setData] = useState([]);
  const { state } = useLocation();
  const userOther = state?.user;
  const [following, setFollowing] = useState(false);
  const navigate = useNavigate();
  const [modalType, setModalType] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const openFollowersModal = (type) => {
    setModalType(type);
  };

  const closeFollowersModal = () => {
    setModalType(null);
  };

  useEffect(() => {
    getProfileData();

    if (userOther.id === user.user_id) {
      navigate('/my-profile/');
    }
  }, [user, userOther, following]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getProfileData = async () => {
    const userId = userOther.id;

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

      if (data.followers.includes(user.user_id)) {
        setFollowing(true);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error.message);
    }
  };

  const getJoinedEvents = async () => {
    const userId = userOther.id;
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
      setModalJoined(true);
    } catch (error) {
      console.error('Error fetching events:', error.message);
    }
  };

  const toggleFollow = async () => {
    const userId = userOther.id;
    const endpoint = following ? `/api/unfollow/${userId}/` : `/api/follow/${userId}/`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(authTokens.access),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to update follow status');
      }

      setFollowing(!following);
    } catch (error) {
      console.error('Error updating follow status:', error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      {userOther && (
        <div className="w-full max-w-[920px] rounded-lg text-gray-900 bg-white px-4 sm:px-6 pb-8 shadow-xl relative">
          <div className="rounded-lg h-32 overflow-hidden bg-customBlue-500"></div>

          <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden bg-gray-200">
            <img src={data.avatar || ava} alt="" />
          </div>

          <div className="text-center mt-2">
            <h2 className="truncate flex-1 text-lg font-semibold">{userOther.username}</h2>
          </div>

          <ul className="py-4 mt-2 text-gray-700 flex items-center justify-around">
            <button onClick={() => openFollowersModal("followers")}>
              <li className="flex flex-col items-center text-lg">
                Followers
                <span>{data?.followers?.length ?? 0}</span>
              </li>
            </button>
            <button onClick={() => openFollowersModal("following")}>
              <li className="flex flex-col items-center text-lg">
                Following
                <span>{data?.following?.length ?? 0}</span>
              </li>
            </button>
          </ul>

        {!isMobile && (          
          <div className="flex justify-center mt-4">
            <button
              onClick={getJoinedEvents}
              className='p-2 ring-2 ring-black rounded-xl text-black text-xl font-bold w-2/6 flex items-center justify-center hover:scale-110 transition'>
              Events
            </button>
          </div>) }

          {isMobile && (           
            <div className="flex justify-center mt-4">
            <button
              onClick={getJoinedEvents}
              className='p-2 ring-2 ring-black rounded-xl text-black text-xl font-bold mx-8 w-full flex items-center justify-center hover:scale-110 transition'>
              Events
            </button>
          </div>)}


          {isMobile && (
          <div className="flex justify-center items-center mt-8">
          <button
            onClick={toggleFollow}
            className={`w-full mx-8 py-4 rounded-lg text-white transition ${
              following ? 'bg-red-600 hover:bg-red-700' : 'bg-customBlue-500 hover:bg-customBlue-600'
            }`}
          >
            {following ? 'Unfollow' : 'Follow'}
          </button>
        </div>

          )}


          {/* Facts */}
          {isMobile && (

              <div className={`w-full flex flex-col ${isMobile ? 'gap-6' : 'justify-between gap-3'} mt-6 relative z-10`}>
              {[1, 2, 3].map((fact) => (
                <div
                  key={fact}
                  className={`shadow-xl border bg-customBlue-100 rounded-xl p-4 flex flex-col ${isMobile ? 'w-full h-48' : 'w-1/3 h-full'}`}
                >
                  <h1 className="text-center text-lg font-bold">Fact {fact}</h1>
                  <hr className="my-2 mx-4 border-gray-300" />
                  
                  <div className="flex flex-col gap-2">
                    {data[`fact${fact}`] ? (
                      <p className="text-center font-bold break-words">{data[`fact${fact}`]}</p>
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
          )}


                    {/* Facts */}
                    {!isMobile && (

                  <div className="h-[24vh] w-full flex justify-between gap-3 mt-6 relative z-10">
                    {[1, 2, 3].map((fact) => (
                      <div
                        key={fact}
                        className={`shadow-xl border bg-customBlue-100 rounded-xl p-4 flex flex-col w-1/3 h-full`}
                      >
                        <h1 className="text-center text-lg font-bold">Fact {fact}</h1>
                        <hr className="my-2 mx-4 border-gray-300" />
                        <div className="flex flex-col gap-2">
                          {data[`fact${fact}`] ? (
                            <p className="text-center font-bold break-words">{data[`fact${fact}`]}</p>
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
                  )}


{ !isMobile && (        <div className="flex justify-center items-center mt-8">
        <button
          onClick={toggleFollow}
          className={`w-2/6 py-3 rounded-lg text-white transition ${
            following ? 'bg-red-600 hover:bg-red-700' : 'bg-customBlue-500 hover:bg-customBlue-600'
          }`}
        >
          {following ? 'Unfollow' : 'Follow'}
        </button>
      </div>)}




          {modalJoined && <JoinedModal closeModal={() => setModalJoined(false)} events={joinedEvents} profile={data ? data : null} />}

          {modalType && (
            <FollowersModal
              closeModal={closeFollowersModal}
              users={modalType === "followers" ? data.followers : data.following}
              title={modalType === "followers" ? "Followers" : "Following"}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;