import React, { useState, useRef,  useEffect, useContext} from 'react';
import { useNavigate} from 'react-router-dom';
import Modal from "../components/Modal"
import { AuthContext } from '../context/AuthContext'
import {useFormik} from "formik"
import basicSchema from '../schemas/FormValidator';
import Swal from "sweetalert2";


// const CreateEventPage = ({eventId}) => {

//   const {authTokens} = useContext(AuthContext)
  
//   const navigate = useNavigate()

//   const [modalOpen, setModalOpen]= useState(false)

//   const [imageSrc, setImageSrc] = useState(null);

//   const picUrl = useRef(null);

//   const fileInputRef = useRef(null);


//   const formik = useFormik({
//       initialValues: {
//       title: '',
//       date: '',
//       description: '',
//       location: '',
//       image: '',
//       capacity: '',
//       category: '',}

//     });


//     useEffect(() => {
//       if (eventId) {
//         const fetchEventData = async () => {
//           try {
//             const response = await fetch(`/api/events-detail/${eventId}`);
//             const data = await response.json();
    
//             if (response.ok) {
//               // Preload event form data
//               formik.setValues({
//                 title: data.title,
//                 date: data.date,
//                 description: data.description,
//                 location: data.location,
//                 image: data.image,
//                 capacity: data.capacity,
//                 category: data.category,
//               });
              
              
//               // Convert image URL to Base64
//               if (data.image) {
//                 const imageResponse = await fetch(data.image);
//                 const blob = await imageResponse.blob();
    
//                 const reader = new FileReader();
//                 reader.onloadend = () => {
//                   const base64String = reader.result;
//                   picUrl.current = base64String; // Save the Base64 string
//                   setImageSrc(base64String); // Show preview
//                   formik.setValues((prev) => ({
//                     ...prev,
//                     image: base64String, // Update form data with the Base64 image
//                   }));
//                 };
//                 reader.readAsDataURL(blob);
//               }
//             } else {
//               console.error('Error fetching event data:', data.message || 'Unknown error');
//             }
//           } catch (error) {
//             console.error('Error fetching event data:', error);
//           }
//         };
    
//         fetchEventData();
//       }
//     }, [eventId]);
    



//   const updatePic = (image) => {
//     picUrl.current = image;
//   };

//   const handleButtonClick = () => {
//     fileInputRef.current.click();

//   };


//   const onSelectFile = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.addEventListener("load", () => {
//       const imageElement = new Image();
//       const imageUrl = reader.result?.toString() || "";
//       imageElement.src = imageUrl;
//       setImageSrc(imageUrl);
//       setModalOpen(true);
//     });
//     reader.readAsDataURL(file);
//   };

  
//     const handleChange = (e) => {
//       setFormData({
//         ...formData,
//         [e.target.name]: e.target.value,
//       });
//     };
  

//     const handleSubmit = async (e) => {
//       e.preventDefault();
    
//       const finalFormData = {
//         ...formData,
//         image: picUrl.current,
//       };
    
//       try {
//         const response = await fetch('/api/events-create/', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer ' + String(authTokens.access)
//           },
//           body: JSON.stringify(finalFormData),
//         });
    
//         const data = await response.json(); 
    
//         if (response.ok) {
  
//           navigate("/my-events")
//         } else {
//           // Failed to create the event, log the errors
//           console.error('Error:', data.errors || data.message || 'Unknown error');
//         }
//       } catch (error) {

//         console.error('Network Error:', error);
//       }
//     };

//     const handleSubmitChange = async (e) => {
//       e.preventDefault();
    
//       const finalFormData = {
//         ...formData,
//         image: picUrl.current,
//       };
    
//       try {
//         const response = await fetch(`/api/events-update/${eventId}/`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer ' + String(authTokens.access)
//           },
//           body: JSON.stringify(finalFormData),
//         });
    
//         const data = await response.json(); 
    
//         if (response.ok) {

//           console.log('Event edited successfully:', data);
//           navigate("/my-events")
//         } else {

//           console.error('Error:', data.errors || data.message || 'Unknown error');
//         }
//       } catch (error) {
//         console.error('Network Error:', error);
//       }
//     };


//     return (
//       <div className="container mx-auto p-4 max-w-2xl bg-white shadow-lg rounded-lg">
//         <h1 className="text-4xl font-bold text-gray-800 mb-6">{eventId ? "Edit Event" : "Create Event"}</h1>
//         <form className="grid grid-cols-1 gap-6" onSubmit={eventId ? handleSubmitChange : handleSubmit}>
  
//           <div>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               placeholder="Event Title"
//               className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-600 focus:ring-red-600 focus:ring-opacity-50 p-3 bg-gray-50"
//             />
//           </div>
  
//           <div>
//             <select
//               id="category"
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-600 focus:ring-red-600 focus:ring-opacity-50 p-3 bg-gray-50"
//             >
//               <option value="">Select a category</option>
//               <option value="Music">Music</option>
//               <option value="Sports">Sports</option>
//               <option value="Arts">Arts</option>
//               <option value="Technology">Technology</option>
//             </select>
//           </div>
  
//           <div>
//             <textarea
//               id="description"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               rows="4"
//               placeholder="Event Description"
//               className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-600 focus:ring-red-600 focus:ring-opacity-50 p-3 bg-gray-50"
//             ></textarea>
//           </div>
  
//           <div>
//             <label
//               htmlFor="image-upload"
//               className={`block w-full h-48 rounded-md cursor-pointer flex flex-col items-center justify-center ${
//                 picUrl.current ? "border-2 border-blue-500" : "border-2 border-dashed border-gray-400"
//               }`}
//             >
//               <div className="text-center">
//                 <div className="mb-2">
//                   <button
//                     type="button"
//                     onClick={handleButtonClick}
//                     className="bg-blue-600 hover:bg-blue-700 text-white rounded-full py-2 px-4"
//                   >
//                     {picUrl.current ? "Upload New Picture" : "Select from the computer"}
//                   </button>
//                 </div>
//                 {picUrl.current ? (
//                   <p className="text-green-500">
//                     Image Uploaded:{" "}
//                     <a
//                       href={picUrl.current}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-500 underline"
//                     >
//                       Preview Image
//                     </a>
//                   </p>
//                 ) : (
//                   <p className="text-gray-500 text-sm mt-1">PNG, JPG, SVG</p>
//                 )}
//               </div>
//             </label>
  
//             <input
//               id="image-upload"
//               name="image"
//               type="file"
//               accept="image/*"
//               className="sr-only"
//               ref={fileInputRef}
//               onChange={onSelectFile}
//             />
//           </div>
  
//           {modalOpen && <Modal closeModal={() => setModalOpen(false)} imageSrc={imageSrc} updatePic={updatePic} />}
  
//           <div>
//             <input
//               type="text"
//               id="location"
//               name="location"
//               value={formData.location}
//               onChange={handleChange}
//               placeholder="Location"
//               className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-600 focus:ring-red-600 focus:ring-opacity-50 p-3 bg-gray-50"
//             />
//           </div>
  
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <input
//                 type="datetime-local"
//                 id="date"
//                 name="date"
//                 value={formData.date}
//                 onChange={handleChange}
//                 className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-600 focus:ring-red-600 focus:ring-opacity-50 p-3 bg-gray-50"
//               />
//             </div>
  
//             <div>
//               <input
//                 type="number"
//                 id="capacity"
//                 name="capacity"
//                 value={formData.capacity}
//                 onChange={handleChange}
//                 placeholder="Capacity"
//                 className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-600 focus:ring-red-600 focus:ring-opacity-50 p-3 bg-gray-50"
//               />
//             </div>
//           </div>
  
//           <div className="mt-4">
//             <button
//               type="submit"
//               className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg"
//             >
//               {eventId ? "Save Changes" : "Create"}
//             </button>
//           </div>
//         </form>
//       </div>
//     );
//   };




const CreateEventPage = ({eventId}) => {

  const {authTokens} = useContext(AuthContext)
  const navigate = useNavigate()
  const [modalOpen, setModalOpen]= useState(false)
  const [imageSrc, setImageSrc] = useState(null);
  const picUrl = useRef(null);
  const fileInputRef = useRef(null);


  const formik = useFormik({
    initialValues: {
      title: '',
      date: '',
      description: '',
      location: '',
      image: '',
      capacity: '',
      category: '',
    },
    validationSchema: basicSchema,
    onSubmit: async (values) => {
      const finalData = {
        ...values,
        image: picUrl.current, // Include image URL from your state
      };
  
      try {
        // Check if eventId exists (if it's an update or new event)
        const method = eventId ? 'PUT' : 'POST';  // Use PUT if eventId exists
        const url = eventId ? `/api/events-update/${eventId}/` : '/api/events-create/';  // Use the right URL based on eventId
  
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access),
          },
          body: JSON.stringify(finalData),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          Swal.fire({
            title: "🎉 Success!",
            text: "Your event has been created or changed!",
            icon: "success",
            confirmButtonColor: "#4CAF50",
          });
          navigate("/my-events");  // Redirect to 'My Events' page
        } else {
          Swal.fire({
            title: "⚠️ Oops!",
            text: data.detail || "You can only create up to 8 events.",
            icon: "error",
            confirmButtonColor: "#d33",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "❌ Error!",
          text: "Something went wrong. Please try again.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }
    },
  });
  
  
  const isFormSet = useRef(false); // Track if form is already updated
  
  useEffect(() => {
    if (eventId && !isFormSet.current) { // Only fetch if form is not set yet
      const fetchEventData = async () => {
        try {
          const response = await fetch(`/api/events-detail/${eventId}`);
          const data = await response.json();
  
          if (!response.ok) {
            throw new Error(data.message || 'Unknown error');
          }
  
          formik.setValues({
            title: data.title || '',
            date: data.date || '',
            description: data.description || '',
            location: data.location || '',
            image: data.image || '',
            capacity: data.capacity || '',
            category: data.category || '',
          });
  
          isFormSet.current = true; 


        } catch (error) {
          console.error('Error fetching event data:', error);
        }
      };
  
      fetchEventData();
    }
  }, [eventId])


  useEffect(()=>{

    if (formik.values.image) {
      picUrl.current = formik.values.image
    }
    else {
    return
    }

  },[formik.values.image])
  

  const onSelectFile = (e) => {
    const file = e.target.files?.[0];
  
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const imageUrl = reader.result?.toString() || "";
  
        formik.setFieldValue("image", file);
        setImageSrc(imageUrl); // Set preview image
        setModalOpen(true);
      });
  
      reader.readAsDataURL(file);
    } else {
      // If no file is selected, mark as touched and show error
      formik.setFieldTouched("image", true);
      formik.setFieldValue("image", null);
      setImageSrc(null); // Clear preview
    }
  };
  

    const updatePic = (image) => {
        picUrl.current = image;
      };




    const handleSubmitChange = async (e) => {
      e.preventDefault();
    
      const finalData = {
        ...formik.values,
        image : picUrl.current,
      };
    
      try {
        const response = await fetch(`/api/events-update/${eventId}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + String(authTokens.access)
          },
          body: JSON.stringify(finalData),
        });
    
        const data = await response.json(); 
    
        if (response.ok) {

          console.log('Event edited successfully:', data);
          navigate("/my-events")
        } else {

          console.error('Error:', data.errors || data.message || 'Unknown error');
        }
      } catch (error) {
        console.error('Network Error:', error);
      }
    };


    return(
      <div className="min-h-screen container mx-auto p-4 max-w-2xl bg-white shadow-lg rounded-lg">
        <h1 className="text-center text-4xl font-bold text-black-800 mb-6">{eventId ? "Edit Event" : "Create Event"}</h1>
        <form className="grid grid-cols-1 gap-6" onSubmit={formik.handleSubmit}>
  
        <div>
          <input
            type="text"
            id="title"
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            placeholder="Event Title"
            onBlur={formik.handleBlur} // Ensure validation on blur
            className={`block w-full rounded-md border shadow-sm p-3 bg-gray-50 
              ${formik.errors.title && formik.touched.title 
                ? "border-red-600 focus:border-red-600 focus:ring-red-600" 
                : "border-gray-300 focus:border-blue-600 focus:ring-blue-600"}`}
          />
          {formik.errors.title && formik.touched.title && (
            <p className="text-red-600 text-sm mt-1">{formik.errors.title}</p>
          )}
        </div>

        <div>
        <select
          id="category"
          name="category"
          value={formik.values.category}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          className={`block w-full rounded-md border shadow-sm p-3 bg-gray-50 
            ${formik.errors.category && formik.touched.category ? "border-red-600 focus:border-red-600 focus:ring-red-600" : ""}`}
        >
          <option value="">Select a category</option>
          <option value="Music">Music</option>
          <option value="Sports">Sports</option>
          <option value="Arts">Arts</option>
          <option value="Technology">Technology</option>
        </select>
        {formik.errors.category && formik.touched.category && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.category}</p>
        )}
      </div>

  
          <div>
            <textarea
              id="description"
              name="description"
              value={formik.values.description}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              rows="4"
              placeholder="Event Description"
              className={`block w-full rounded-md border shadow-sm p-3 bg-gray-50 
                ${formik.errors.description && formik.touched.description 
                  ? "border-red-600 focus:border-red-600 focus:ring-red-600" 
                  : "border-gray-300 focus:border-blue-600 focus:ring-blue-600"}`}
            >
            </textarea>
            {formik.errors.description && formik.touched.description && (
          <p className="text-red-600 text-sm mt-1">{formik.errors.description}</p>
        )}
          </div>
  
          <div>
            {picUrl.current ? (
              <>
                <label
                  htmlFor="image-upload"
                  className={`block w-full h-auto min-h-56 rounded-md cursor-pointer flex flex-col items-center justify-center border-2 p-4 
                  border bg-gray-50`}
                >
                  <div className="text-center flex flex-col items-center gap-3">
                    <div className="rounded-md overflow-hidden p-2">
                      <img
                        src={picUrl.current}
                        alt="Picture"
                        className="max-w-full h-40 object-cover rounded-md"
                      />
                    </div>

                    <button
                      onClick={() => fileInputRef.current.click()}
                      type="button"
                      className="bg-customBlue-600 hover:bg-customBlue-700 text-white rounded-full py-2 px-4"
                    >
                      Upload New Picture
                    </button>

                    <p className="text-gray-500 text-md mt-1">PNG, JPG, SVG</p>
                  </div>

                  <input
                    id="image-upload"
                    name="image"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    ref={fileInputRef}
                    onChange={onSelectFile}
                  />
                </label>

              </>
            ) : (
              <label
                htmlFor="image-upload"
                className={`bg-gray-50 block w-full h-48 rounded-md cursor-pointer flex flex-col items-center justify-center border-2 
                ${formik.errors.image && formik.touched.image ? " border-red-600" : 'border-dashed border-gray-400 p-4'}`}
              >
                <div className="text-center">
                  <div className="mb-2">

                    <button
                      onClick={() => fileInputRef.current.click()}
                      type="button"
                      className="bg-customBlue-600 hover:bg-customBlue-700 text-white rounded-full py-2 px-4"
                    >
                      Select from the computer
                    </button>

                  </div>
                  <p className="text-gray-500 text-md mt-1">PNG, JPG, SVG</p>
                </div>

                <input
                  id="image-upload"
                  name="image"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  ref={fileInputRef}
                  onChange={onSelectFile}
                  onBlur={formik.handleBlur}
                />
              </label>
            )
            }
              {formik.errors.image && formik.touched.image && (
                <p className="text-red-600 text-sm mt-1">{formik.errors.image}</p>
              )}
          </div>


  
          {modalOpen && <Modal closeModal={() => setModalOpen(false)} imageSrc={imageSrc} updatePic={updatePic} />}
  
          
          <div>
            <input
              type="text"
              id="location"
              name="location"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Location"
              className={`block w-full rounded-md border shadow-sm p-3 bg-gray-50 
                ${formik.errors.location && formik.touched.location 
                  ? "border-red-600 focus:border-red-600 focus:ring-red-600" 
                  : "border-gray-300 focus:border-blue-600 focus:ring-blue-600"}`}
            />
            {formik.errors.location && formik.touched.location && (
              <p className="text-red-600 text-sm mt-1">{formik.errors.location}</p>
            )}
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <input
                type="datetime-local"
                id="date"
                name="date"
                value={formik.values.date ? formik.values.date.slice(0, 16) : ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`block w-full rounded-md border shadow-sm p-3 bg-gray-50 
                  ${formik.errors.date && formik.touched.date 
                    ? "border-red-600 focus:border-red-600 focus:ring-red-600" 
                    : "border-gray-300 focus:border-blue-600 focus:ring-blue-600"}`}
              />
              {formik.errors.date && formik.touched.date && (
                <p className="text-red-600 text-sm mt-1">{formik.errors.date}</p>
              )}
            </div>

            <div>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formik.values.capacity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Capacity"
                className={`block w-full rounded-md border shadow-sm p-3 bg-gray-50 
                  ${formik.errors.capacity && formik.touched.capacity 
                    ? "border-red-600 focus:border-red-600 focus:ring-red-600" 
                    : "border-gray-300 focus:border-blue-600 focus:ring-blue-600"}`}
              />
              {formik.errors.capacity && formik.touched.capacity && (
                <p className="text-red-600 text-sm mt-1">{formik.errors.capacity}</p>
              )}
            </div>
            
          </div>
  
          <div className="mt-4">
            <button
              type="submit"
              className="block w-full bg-customBlue-500 hover:bg-customBlue-600 text-white font-bold py-3 px-4 rounded-lg"
            >
              {eventId ? "Save Changes" : "Create"}
            </button> 
          </div> 
          
        </form>
      </div>
    )

  }
export default CreateEventPage;
