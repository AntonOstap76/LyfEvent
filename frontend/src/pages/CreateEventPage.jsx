import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from "../components/Modal";
import { AuthContext } from '../context/AuthContext';
import { useFormik } from "formik";
import basicSchema from '../schemas/FormValidator';
import Swal from "sweetalert2";
import heic2any from "heic2any"

const CreateEventPage = ({ eventId }) => {
  const { authTokens, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const picUrl = useRef(null);
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState([]);

  const [loading, setLoading] =  useState(false)

  

  const formik = useFormik({
    initialValues: {
      title: '',
      date: '',
      description: '',
      location: '',
      image: '',
      capacity: '',
      category: '',
      for_students: false,
    },
    validationSchema: basicSchema,

    onSubmit: async (values) => {
      const date = new Date(values.date);  // Create a Date object from the form date
      const utcDate = date.toISOString();
      const finalData = {
        ...values,
        date: utcDate,
        image: picUrl.current, // Include image URL from your state
        
      };

      setLoading(true)
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
          setLoading(false)
          Swal.fire({
            icon: "success",
            title: "Event has been created/changed",
            showConfirmButton: true,
          });
          navigate("/my-events");  // Redirect to 'My Events' page
        } else {
          Swal.fire({
            title: "⚠️ Oops!",
            text: data.detail || "You can only create up to 4 events.",
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
          for_students: data.for_students || '',
        });

        isFormSet.current = true;
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };

    if (eventId && !isFormSet.current) { // Only fetch if form is not set yet
      fetchEventData();
    }
  }, [eventId]);


  useEffect(() => {
    if (formik.values.image) {
      picUrl.current = formik.values.image;
    }
  }, [formik.values.image]);

  useEffect(() => { 
    checkStudentStatus()
  }, [user]);

  const checkStudentStatus = async () => {
    try {
      const response = await fetch(`/api/profile/${user.user_id}/`, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authTokens.access}` },
      });

      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const onSelectFile = async (e) => {
    const file = e.target.files?.[0];
  
    if (!file) return;
  
    setLoading(true)
  
    const reader = new FileReader();
  
    try {
      let processedFile = file;

      if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
        const blob = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.3 });
        processedFile = new File([blob], file.name.replace(/\.heic$/, ".jpeg"), { type: "image/jpeg" });
      }

      const img = new Image();
      img.src = URL.createObjectURL(processedFile);
  
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
  
        // Set canvas dimensions to match image dimensions
        canvas.width = img.width;
        canvas.height = img.height;
  
        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0);
  
        // Compress the image by reducing quality
        let quality = 0.8; // Start with 80% quality
        let compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
  
        // Check file size and decrease quality if it's over 3MB
        while (compressedDataUrl.length > 3 * 1024 * 1024 && quality > 0.1) {
          quality -= 0.05; // Reduce quality in steps of 5%
          compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        }
  
        // Convert the compressed data URL back to a Blob
        const byteString = atob(compressedDataUrl.split(",")[1]);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uintArray = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
          uintArray[i] = byteString.charCodeAt(i);
        }
  
        const compressedBlob = new Blob([uintArray], { type: "image/jpeg" });
        processedFile = new File([compressedBlob], file.name, { type: "image/jpeg" });
  
        // Set the image source for display and update the form field value
        setImageSrc(compressedDataUrl);

        formik.setFieldValue("image", processedFile);
  
        setModalOpen(true);
        setLoading(false)
      };
    } catch (error) {
      console.error("File processing error:", error);
    }
  };
  
  
  const updatePic = (imageUrl) => {
  
    picUrl.current = imageUrl;
  
  };
  
  

  return (
    <div className="min-h-screen container mx-auto p-4 max-w-2xl bg-white shadow-lg rounded-lg">
      <h1 className="text-center text-4xl font-bold text-black-800 mb-6">{eventId ? "Edit Event" : "Create Event"}</h1>

      <form className="grid grid-cols-1 gap-6" onSubmit={formik.handleSubmit}>
        {profile?.student && (
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="for_students"
                name="for_students"
                checked={formik.values.for_students}
                onChange={(e) => {
                  formik.setFieldValue("for_students", e.target.checked);
                }}
                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700">Only for students</span>
            </label>
          </div>
        )}

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
            <option value="Fun">Fun</option>
            <option value="Study">Study</option>
            <option value="Chill">Chill</option>
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
          )}
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
  <div className="w-full">
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

  <div className="w-full">
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

          disabled={loading}
          className="block w-full bg-customBlue-500 hover:bg-customBlue-600 text-white font-bold py-3 px-4 rounded-lg flex justify-center items-center"
        >
          {loading ? (
            <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
          ) : eventId ? "Save Changes" : "Create"}
        </button>


        </div>
      </form>
    </div>
  );
};

export default CreateEventPage;