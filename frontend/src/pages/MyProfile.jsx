import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import JoinedModal from '../components/JoinedModal';
import ava from '../assets/img/ava.svg';
import Plus from '../components/PlusIcon';
import { motion } from "framer-motion";
import FollowersModal from '../components/FollowersModal';
import { useFormik } from "formik";
import Swal from "sweetalert2";
import ModalAva from '../components/ModalAva';
import { useNavigate } from 'react-router-dom';
import FactsModal from '../components/FactsModal';
import heic2any from "heic2any"; // Import the library

const MyProfile = () => {
  const { user, logoutUser, authTokens } = useContext(AuthContext);
  const [modalJoined, setModalJoined] = useState(false);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [data, setData] = useState([]);
  const [edit, setEdit] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [avaModal, setAvaModal] = useState(false);
  const [factModal, setFactModal] = useState(false);
  const [selectedFact, setSelectedFact] = useState(null);
  const [selectedFactText, setSelectedFactText] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const picUrl = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const openFollowersModal = (type) => {
    setModalType(type);
  };

  const closeFollowersModal = () => {
    setModalType(null);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        const method = "PUT";
        const url = `/api/profile-update/${user.user_id}/`;

        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access),
          },
          body: JSON.stringify(finalData),
        });

        if (response.ok) {
          Swal.fire({
            title: "🎉 Success!",
            text: "Your profile has been saved!",
            icon: "success",
            confirmButtonColor: "#4CAF50",
          });

          setEdit(false);
          navigate('/my-profile');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    },
  });

  const isFormSet = useRef(false);

  useEffect(() => {
    if (user.user_id && !isFormSet.current) {
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

  useEffect(() => {
    if (formik.values.avatar) {
      picUrl.current = formik.values.avatar;
    }
  }, [formik.values.avatar]);

  const handleFactClick = (fact) => {
    setSelectedFact(fact);
  };

  useEffect(() => {
    if (selectedFact !== null && formik.values) {
      setSelectedFactText(formik.values[`fact${selectedFact}`]);
      setFactModal(true);
    }
  }, [selectedFact]);


  
  const onSelectFile = async (e) => {
    const file = e.target.files?.[0];
  
    if (!file) return;
  
    try {
      let processedFile = file;
  
      // Convert HEIC to JPEG
      if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
        const blob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.8 });
        processedFile = new File([blob], file.name.replace(/\.heic$/, ".jpeg"), { type: "image/jpeg" });
      }
  
      const img = new Image();
      img.src = URL.createObjectURL(processedFile);
  
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
  
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
  
        // Compress the image with decreasing quality until it's below 3MB
        let quality = 0.8;
  
        const compressAndSetImage = (blob) => {
          const compressedFile = new File([blob], processedFile.name, { type: "image/jpeg" });
  
          // Update state
          setImageSrc(URL.createObjectURL(blob));
          setAvaModal(true);
          formik.setFieldValue("avatar", compressedFile);
        };
  
        const checkSizeAndCompress = () => {
          canvas.toBlob((blob) => {
            if (blob.size > 3 * 1024 * 1024 && quality > 0.1) {
              quality -= 0.05;
              checkSizeAndCompress();
            } else {
              compressAndSetImage(blob);
            }
          }, "image/jpeg", quality);
        };
  
        checkSizeAndCompress();
      };
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };
  




  const updatePic = (image) => {
    picUrl.current = image;
  };

  const updateFact = (updatedFact) => {
    formik.setFieldValue(`fact${selectedFact}`, updatedFact);
    setSelectedFactText(null);
  };

  const getJoinedEvents = async () => {
    const userId = user.user_id;
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

  const calculateProgress = () => {
    let progress = 0;
    if (formik.values.avatar) progress += 27;
    if (formik.values.fact1) progress += 32;
    if (formik.values.fact2) progress += 18;
    if (formik.values.fact3) progress += 23;
    return progress;
  };

  const progress = calculateProgress();

  useEffect(() => {
    if (progress === 100 && !localStorage.getItem("profileCompletePopupShown")) {
      Swal.fire({
        title: "🎉 Congratulations!",
        text: "You did it! Your profile is complete.",
        icon: "success",
        confirmButtonColor: "#4CAF50",
      });

      localStorage.setItem("profileCompletePopupShown", "true");
    }
  }, [progress]);

  const editActivate = () => {
    setEdit(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      {user ? (
        edit ? (
          <form action=" " onSubmit={formik.handleSubmit} className="w-full max-w-[920px] rounded-lg text-gray-900 bg-white px-4 sm:px-6 pb-8 shadow-xl relative">
             <div className="rounded-lg h-32 overflow-hidden bg-customBlue-500"></div>


            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden bg-gray-200 z-10 flex items-center justify-center"
            >
              <img src={picUrl.current || ava} alt="Avatar" className="absolute w-full h-full object-cover" />
              <motion.div
                animate={{ rotate: 180 }}
                whileHover={{ rotate: 0 }}
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

            <div className="text-center mt-2 relative">
              <h2 className="font-semibold text-2xl">{user.username}</h2>
            </div>

            {!isMobile && (
                // Facts Section
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
              )}







          {/* Facts */}
          {isMobile && (

              <div className={`w-full flex flex-col ${isMobile ? 'gap-6' : 'justify-between gap-3'} mt-6 relative z-10`}>
              {[1, 2, 3].map((fact) => (
                <motion.button
                type="button"
                key={fact}
                onClick={() => handleFactClick(fact)}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                <div
                  key={fact}
                  className={`shadow-xl border bg-customBlue-100 rounded-xl p-4 flex flex-col ${isMobile ? 'w-full h-48' : 'w-1/3 h-full'}`}
                >
                  <h1 className="text-center text-lg font-bold">Fact {fact}</h1>
                  <hr className="my-2 mx-4 border-gray-300" />

                        {/* Centered Plus Icon */}
                        <div className='flex justify-center'>
                        <motion.div
                          animate={{ rotate: 180 }}
                          whileHover={{ rotate: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="absolute mt-6  w-12 h-12 bg-white/40 flex items-center justify-center rounded-full z-25"
                        >
                          <Plus className="text-white" />
                        </motion.div>
                        </div>
                  
                  <div className="flex flex-col gap-2">
                    {formik.values[`fact${fact}`] ? (
                      <p className="text-center font-bold break-words">{formik.values[`fact${fact}`]}</p>
                    ) : (
                      <>
                        <div className="w-full h-4 bg-gray-300 rounded"></div>
                        <div className="w-5/6 h-4 bg-gray-300 rounded"></div>
                        <div className="w-4/6 h-4 bg-gray-300 rounded"></div>
                      </>
                    )}
                  </div>
                </div>
                </motion.button>
              ))}
              </div>
              )}




          

            <div className="flex justify-center items-center mt-8 relative z-10">
              <div className="flex flex-row justify-around w-full">
                <button
                  onClick={() => {
                    if (edit) {
                      formik.handleSubmit();
                    } else {
                      setEdit(true);
                    }
                  }}
                  type={edit ? "submit" : "button"}
                  className="w-3/6 bg-customBlue-500 text-white py-3 rounded-lg hover:bg-customBlue-600 transition font-semibold"
                >
                  {edit ? "Save" : "Edit Profile"}
                </button>
               
              </div>
            </div>

            {avaModal && <ModalAva closeModal={() => setAvaModal(false)} imageSrc={imageSrc} updatePic={updatePic} />}
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
          </form>
        ) : (
          <div className="w-full max-w-[920px] rounded-lg text-gray-900 bg-white px-4 sm:px-6 pb-8 shadow-xl relative">
            <div className="rounded-lg h-32 overflow-hidden bg-customBlue-500"></div>

            <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden bg-gray-200 z-10">
              <img src={picUrl.current || ava} alt="Avatar" className="absolute w-full h-full object-cover" />
            </div>

            <div className="truncate flex-1 text-center mt-2 relative z-10">
              <h2 className="font-semibold text-2xl">{user.username}</h2>
            </div>

            <div className="mt-4">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-[#6d6fff] transition-all duration-700 ease-in-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-center text-gray-700 font-semibold mt-2">
                Profile Completion: {progress}%
              </p>
            </div>

            <div className={`relative transition-all duration-300 z-0`}>
              <ul className="py-4 mt-2 text-gray-700 flex items-center justify-around">
                <button onClick={() => openFollowersModal("followers")}>
                  <li className="flex flex-col items-center text-lg font-semibold">
                    Followers
                    <span>{data?.followers?.length ?? 0}</span>
                  </li>
                </button>
                <button onClick={() => openFollowersModal("following")}>
                  <li className="flex flex-col items-center text-lg font-semibold">
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
              Joined Events
            </button>
          </div>) }

          {isMobile && (           
            <div className="flex justify-center mt-4">
            <button
              onClick={getJoinedEvents}
              className='p-2 ring-2 ring-black rounded-xl text-black text-xl font-bold mx-8 w-full flex items-center justify-center hover:scale-110 transition'>
              Joined Events
            </button>
          </div>)}



            </div>

          {/* Facts */}
          {!isMobile && (

            <div className="h-[24vh] w-full flex justify-between gap-3 mt-6 relative z-10">
              {[1, 2, 3].map((fact) => (
                <div
                  key={fact}
                  className={`shadow-xl border bg-customBlue-100 rounded-xl p-4 flex flex-col ${isMobile ? 'w-full h-48' : 'w-1/3 h-full'}`}
                >
                  <h1 className="text-center text-lg font-bold">Fact {fact}</h1>
                  <hr className="my-2 mx-4 border-gray-300" />
                  <div className="flex flex-col gap-2">
                    {formik.values[`fact${fact}`] ? (
                      <p className="text-center font-bold break-words">{formik.values[`fact${fact}`]}</p>
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
                  {formik.values[`fact${fact}`] ? (
                    <p className="text-center font-bold break-words">{formik.values[`fact${fact}`]}</p>
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





            

            <div className="flex justify-center items-center mt-8 relative z-10">
              <div className="flex flex-row justify-around w-full font-semibold">
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
                  className="w-2/6 bg-customBlue-500 text-white py-3 rounded-lg hover:bg-customBlue-600 transition"
                >
                  {edit ? "Save" : "Edit Profile"}
                </button>
                <button
                  onClick={logoutUser}
                  className="w-2/6 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold"
                >
                  Logout
                </button>
              </div>
            </div>

            {modalJoined && <JoinedModal closeModal={() => setModalJoined(false)} events={joinedEvents} profile={data ? data : null} />}
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