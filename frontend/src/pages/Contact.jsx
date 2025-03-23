import React, { useState } from "react";
import Swal from "sweetalert2"; // Import SweetAlert


const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/contact/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send formData directly
      });

      if (response.ok) {
        setSubmitted(true); // Show success banner

        Swal.fire({
          title: "Success!",
          text: "Your message has been sent to the admin.",
          icon: "success",
          confirmButtonColor: "#4CAF50",
        });

        setFormData({ name: "", email: "", message: "" }); // Reset form
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="min-h-full bg-gray-100 flex items-center justify-center pb-20">
      <div className="bg-white shadow-xl rounded-3xl w-full max-w-3xl pt-10 relative overflow-hidden">
        <h2 className="text-4xl font-bold text-center text-black mb-6">
          Contact Us
        </h2>

        <p className="text-gray-600 text-center mb-6">
          We'd love to hear from you! Send us a message and we'll get back as soon as possible.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8 px-6 pb-10">
          {/* Name Field */}
          <div className="relative">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-6 py-5 bg-gray-50 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Your Name"
              required
            />
          </div>

          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-6 py-5 bg-gray-50 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Your Email"
              required
            />
          </div>

          {/* Message Field */}
          <div className="relative">
            <textarea
              name="message"
              rows="6"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-6 py-5 bg-gray-50 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Your Message"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="w-1/2 bg-[#6d6fff] text-white py-4 px-6 rounded-xl hover:bg-[#5a5ae6] hover:shadow-lg transform transition-all hover:scale-105 font-semibold"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
