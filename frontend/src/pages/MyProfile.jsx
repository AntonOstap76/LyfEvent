import React, { useContext, useState, useEffect, useRef} from 'react';
import { AuthContext } from '../context/AuthContext';
import JoinedModal from '../components/JoinedModal'
import ava from '../assets/img/ava.svg';
import Plus from '../components/PlusIcon';
import { motion } from "framer-motion";

import FollowersModal from '../components/FollowersModal';

import {useFormik} from "formik"

import Swal from "sweetalert2";
import ModalAva from '../components/ModalAva';
import { useNavigate } from 'react-router-dom';
import FactsModal from '../components/FactsModal';

const MyProfile = () => {

  const { user, logoutUser, authTokens} = useContext(AuthContext);
  const [modalJoined, setModalJoined] = useState(false)
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [data, setData] = useState([])
  const [edit, setEdit] = useState(false)
  
  const [modalType, setModalType] = useState(null);


const openFollowersModal = (type) => {
  setModalType(type);
};

const closeFollowersModal = () => {
  setModalType(null);
};

  const [avaModal, setAvaModal] = useState(false)
  const [factModal, setFactModal] = useState(false)

  const [selectedFact, setSelectedFact] = useState(null);
  const [selectedFactText, setSelectedFactText] = useState(null);

  const [imageSrc, setImageSrc] = useState(null);
  const picUrl = useRef(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate()
  


  const formik = useFormik({
    initialValues: {
      avatar: '', 
      fact1: '',
      fact2: '',
      fact3: '',

    },
    
    onSubmit: async (values) => {
      const finalData = {
        ...values,
        avatar: picUrl.current, 
      };
  
      try {

        const method = "PUT"  
        const url =`/api/profile-update/${user.user_id}/` 
  
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access),
          },
          body: JSON.stringify(finalData),
        });

        // const data = await response.json();
        // console.log(data)
        // const responseText = await response.text();  // Get raw response text
        // console.log(responseText);

        if (response.ok) {

          Swal.fire({
            title: "🎉 Success!",
            text: "Your profile has been saved!",
            icon: "success",
            confirmButtonColor: "#4CAF50",
          });

          setEdit(false)
          navigate('/my-profile')

        }

      } catch (error) {
        console.error('Error updating profile:', error);
      }
    },
  });


  const isFormSet = useRef(false);
    
  useEffect(() => {
    if (user.user_id && !isFormSet.current) { // Only fetch if form is not set yet
      const fetchProfileData = async () => {
        try {
          const response = await fetch(`/api/profile/${user.user_id}/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + String(authTokens.access),
            },
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch profile data');
          }
  
          const data = await response.json();
          setData(data);
  
          formik.setValues({
            avatar: data.avatar || '',
            fact1: data.fact1 || '',
            fact2: data.fact2 || '',
            fact3: data.fact3 || '',
          });
  
          isFormSet.current = true;
        } catch (error) {
          console.error('Error fetching profile data:', error.message);
        }
      };
  
      fetchProfileData();
    }
  }, [user.user_id]);
  



  useEffect(()=>{

    if (formik.values.avatar) {
      picUrl.current = formik.values.avatar
    }
    else {
    return
    }

  },[formik.values.avatar])


  const handleFactClick = (fact) => {
    setSelectedFact(fact);
  };


  // useEffect(() => {
  //   if (selectedFact !== null && formik.values) {
      
  //     setSelectedFactText(formik.values[`fact${selectedFact}`]);

  //   }
  // }, [selectedFact, formik.values]);


  useEffect(() => {
    if (selectedFact !== null && formik.values) {
      setSelectedFactText(formik.values[`fact${selectedFact}`]);
      setFactModal(true);
    }
  }, [selectedFact]);
  

  const onSelectFile = (e) => {
    const file = e.target.files?.[0];
  
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const imageUrl = reader.result?.toString() || "";
  
        formik.setFieldValue("avatar", file);
        setImageSrc(imageUrl); // Set preview image
        setAvaModal(true);
      });
  
      reader.readAsDataURL(file);
    } else {

      if (picUrl.current ){
        return
      }
      
      formik.setFieldTouched("avatar", true);
      formik.setFieldValue("avatar", null);
      setImageSrc(null); // Clear preview
    }
  };
  

    const updatePic = (image) => {
        picUrl.current = image;
      };

  const updateFact = (updatedFact) => {
    formik.setFieldValue(`fact${selectedFact}`, updatedFact);
    setSelectedFactText(null)
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

  console.log("data: ",data);


  return (
  
    <div className="min-h-screen flex flex-col items-center px-4 sm:px-7 lg:px-8">

      {user ? (
        edit ? (
          
          <form action=" " onSubmit={formik.handleSubmit} className="w-full max-w-[920px] rounded-lg text-gray-900 bg-white px-4 sm:px-6 pb-8 shadow-xl relative">
          
          {/* <div className="w-3/6 rounded-lg text-gray-900 bg-white px-6 pb-8 shadow-xl relative"> */}

          <div className="absolute inset-0 w-full h-full bg-white/30 rounded-lg z-0"></div>
    
    
          <div className="rounded-lg h-32 overflow-hidden bg-customBlue-500 relative z-10 flex items-top justify-center">
          </div>
    

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden bg-gray-200 z-10 flex items-center justify-center"
          >
            <img src={picUrl.current || ava} alt="Avatar" className="absolute w-full h-full object-cover" />
            <motion.div
              animate={{ rotate: 180 }} // Default state
              whileHover={{ rotate: 0 }} // Rotates back on hover (triggered by motion.div)
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute w-12 h-12 bg-white/40 flex items-center justify-center rounded-full mb-2"
            >
              <Plus className="text-white" />
            </motion.div>
            {edit && (
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={onSelectFile}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            )}
          </motion.button>


    
          {/* Username */}
          <div className="text-center mt-2 relative ">
            <h2 className="font-semibold text-2xl">{user.username}</h2>
          </div>
    
          {/* Facts Section */}
          <div className="h-[24vh] w-full flex justify-between gap-3 mt-6 relative z-10">
            {[1, 2, 3].map((fact) => (
              <motion.button
                type="button"
                key={fact}
                onClick={() => handleFactClick(fact)}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="w-1/3 shadow-xl border bg-customBlue-100 rounded-xl h-full p-4 flex flex-col justify-between items-center transition relative"
              >
                {/* Centered Plus Icon */}
                <motion.div
                  animate={{ rotate: 180 }}
                  whileHover={{ rotate: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="absolute mt-16 w-12 h-12 bg-white/40 flex items-center justify-center rounded-full"
                >
                  <Plus className="text-white" />
                </motion.div>

                {/* Title with Fixed Height */}
                <div className="h-10 flex items-center">
                  <h1 className="text-center text-lg font-bold">Fact {fact}</h1>
                </div>

                {/* Divider with Fixed Height for Consistency */}
                <div className="h-4 flex items-center w-full">
                  <hr className="border-gray-300 w-full" />
                </div>

                {/* Fact Content / Placeholder */}
                <div className="flex flex-col gap-2 w-full flex-grow">
                  {formik.values[`fact${fact}`] ? (
                    <p className="text-center font-bold break-words">
                      {formik.values[`fact${fact}`]}
                    </p>
                  ) : (
                    <>
                      <div className="w-full h-4 bg-gray-300 rounded"></div>
                      <div className="w-5/6 h-4 bg-gray-300 rounded"></div>
                      <div className="w-4/6 h-4 bg-gray-300 rounded"></div>
                    </>
                  )}
                </div>
              </motion.button>
            ))}
          </div>



            {/* Edit & Logout Buttons */}
            <div className="flex justify-center items-center mt-8 relative z-10">
              <div className="flex flex-row justify-around w-full">
              <button
                onClick={() => {
                  if (edit) {
                    formik.handleSubmit(); // Trigger form submission when in edit mode
                  } else {
                    setEdit(true); // Toggle edit mode when not in edit mode
                  }
                }}
                type={edit ? "submit" : "button"} // Ensure proper form behavior
                className="w-2/6 bg-customBlue-500 text-white py-2 rounded-lg hover:bg-customBlue-600 transition font-semibold"
              >
                {edit ? "Save" : "Edit Profile"}
              </button>

                <button
                  onClick={logoutUser}
                  className="w-2/6 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold"
                >
                  Logout
                </button>
              </div>
            </div>
  
            {avaModal && <ModalAva closeModal={() => setAvaModal(false)} imageSrc={imageSrc} updatePic={updatePic}/>}

            {factModal && (
                    <FactsModal
                      closeModal={() => {
                        setFactModal(false);
                        setSelectedFact(null);
                      }}
                      Fact={selectedFactText}
                      updateFact={updateFact}
                    />
                  )}

          {/* </div> */}
          
          </form>   


        ) : (
          <div className="w-full max-w-[920px] rounded-lg text-gray-900 bg-white px-4 sm:px-6 pb-8 shadow-xl relative">
            {/* Background Blur Effect (applies only to the content inside) */}
            <div className="absolute inset-0 w-full h-full bg-white/30 rounded-lg z-0"></div>
  

            <div className="rounded-lg  h-32 overflow-hidden bg-customBlue-500 relative z-10"></div>
  
            <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden bg-gray-200 z-10">
               <img src={picUrl.current || ava} alt="Avatar" className="absolute w-full h-full object-cover" />
            </div>
  
            <div className="truncate flex-1 text-center mt-2 relative z-10">
              <h2 className="font-semibold text-2xl">{user.username}</h2>
            </div>
  
    
            <div className={`relative  transition-all duration-300 z-0`}>
   
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
                  <span>{data?.following?.length ??  0}</span>
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
                    {formik.values[`fact${fact}`] ? (
                      <p className="text-center font-bold break-words">
                      {formik.values[`fact${fact}`]}
                    </p>
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

            {/* Edit & Logout Buttons */}
            <div className="flex justify-center items-center mt-8 relative z-10">
              <div className="flex flex-row justify-around w-full">
                <button
                  onClick={() => {
                    if (edit) {
                      formik.handleSubmit();
                    } else {
                      setEdit(true);
                      setAvaModal(false);
                      setFactModal(false);
                    }
                  }}
                  className="w-2/6 bg-customBlue-500 text-white py-2 rounded-lg hover:bg-customBlue-600 transition"
                >
                  {edit ? "Save" : "Edit Profile"}
                </button>
                <button
                  onClick={logoutUser}
                  className="w-2/6 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold"
                >
                  Logout
                </button>
              </div>
            </div>
  
            {/* Modal */}
            {modalJoined &&   <JoinedModal closeModal={() => setModalJoined(false)} events={joinedEvents} profile={data ? data : null}/>}

            {modalType && (
              <FollowersModal
                closeModal={closeFollowersModal}
                users={modalType === "followers" ? data.followers : data.following}
                title={modalType === "followers" ? "Followers" : "Following"}
              />
            )}
          </div>
        )
      ) : null}
    </div>
  );
  
  
  
  
  
};

export default MyProfile;
