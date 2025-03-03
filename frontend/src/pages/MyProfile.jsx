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
  const [fact1Modal, setFact1Modal] = useState(false)
  const [fact2Modal, setFact2Modal] = useState(false)
  const [fact3Modal, setFact3Modal] = useState(false)

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
            text: "Your profile has been changed!",
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
            console.error('Error fetching profile  data:', error.message);
          }

        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      };
  
      fetchProfileData();
    }
  }, [user.user_id, formik]);



  useEffect(()=>{

    if (formik.values.avatar) {
      picUrl.current = formik.values.avatar
    }
    else {
    return
    }

  },[formik.values.avatar])
  
  

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
  
    <div className="min-h-screen flex flex-col items-center relative">

      {user ? (
        edit ? (
          
          <form action=" " onSubmit={formik.handleSubmit} className="w-3/6 rounded-lg text-gray-900 bg-white px-6 pb-8 shadow-xl relative">
          
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
            <h2 className="font-semibold">{user.username}</h2>
          </div>
    
          {/* Facts Section */}
          <div className="h-[24vh] w-full flex justify-between gap-3 mt-6 relative z-10">
            {[1, 2, 3].map((fact) => (
              <motion.button
              key={fact}
              whileHover={{ scale: 1.1 }} // Scale effect on hover
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="w-1/3 shadow-xl border bg-customBlue-100 rounded-xl h-full p-4 flex flex-col items-center justify-center transition relative"
            >
              {/* Plus Icon rotates when hovering on the entire Fact div */}
              <motion.div
                animate={{ rotate: 180 }} // Default state
                whileHover={{ rotate: 0 }} // Rotates back on hover (triggered by motion.div)
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute w-12 h-12 bg-white/40 flex items-center justify-center rounded-full mb-2"
              >
                <Plus className="text-white" />
              </motion.div>
              
              <h1 className="text-center text-lg font-bold">Fact {fact}</h1>
              <hr className="my-2 mx-4 border-gray-300" />
              <div className="flex flex-col gap-2 mt-2">
                <div className="w-full h-4 bg-gray-300 rounded"></div>
                <div className="w-5/6 h-4 bg-gray-300 rounded"></div>
                <div className="w-4/6 h-4 bg-gray-300 rounded"></div>
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
  
            {avaModal && <ModalAva closeModal={() => setAvaModal(false)} imageSrc={imageSrc} updatePic={updatePic}/>}

          {/* </div> */}
          
          </form>   


        ) : (
          <div className="w-3/6 rounded-lg text-gray-900 bg-white px-6 pb-8 shadow-xl relative">
            {/* Background Blur Effect (applies only to the content inside) */}
            <div className="absolute inset-0 w-full h-full bg-white/30 rounded-lg z-0"></div>
  
            {/* Banner (Exempt from Blur) */}
            <div className="rounded-lg  h-32 overflow-hidden bg-customBlue-500 relative z-10"></div>
  
            {/* Avatar (Exempt from Blur) */}
            <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden bg-gray-200 z-10">
               <img src={picUrl.current || ava} alt="Avatar" className="absolute w-full h-full object-cover" />
            </div>
  
            {/* Username (Exempt from Blur) */}
            <div className="truncate flex-1 text-center mt-2 relative z-10">
              <h2 className="font-semibold">{user.username}</h2>
            </div>
  
            {/* Blur Wrapper (Everything Else) */}
            <div className={`relative ${edit ? "blur-md" : ""} transition-all duration-300 z-0`}>
              {/* Follow Section */}
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
