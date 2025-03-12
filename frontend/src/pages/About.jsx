import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import logo from "../assets/logo/logo.svg";


const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center space-y-12">
      
      {/* Hero Section */}
      <div className="w-full bg-[#6d6fff] text-white py-16 text-center shadow-lg">
        <h1 className="text-5xl font-extrabold mb-4">About Us</h1>
        <p className="font-semibold text-3xl">
          Empowering communities by connecting people to meaningful events.
        </p>
        <img
          src={logo}
          className="mt-6 mx-auto w-32 h-auto rounded-lg shadow-md"
          alt="Company Logo"
        />
      </div>

      {/* Content Container */}
      <div className="w-full max-w-6xl space-y-8">
        
        {/* Who We Are */}
        <section className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-4xl font-bold text-[#6d6fff] mb-4 text-center">Who We Are</h2>
          <p className="text-gray-700 leading-relaxed text-xl text-center ">
            We are three friends passionate about helping people discover events in the city. 
            Our platform allows users to{" "}
            <span className="font-semibold text-[#6d6fff]">easily create events</span>{" "}
            on topics they love. This project is our initiative to build something meaningful.
          </p>
        </section>
          <div>
            
          </div>
        {/* Our Mission */}
        <section className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-4xl font-bold text-[#6d6fff] mb-4 text-center">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed text-xl text-center ">
            Our mission is to{" "}
            <span className="text-[#6d6fff] font-semibold">connect people with events</span>{" "}
            that matter most to them. Whether it’s a concert, workshop, or a networking event, 
            we strive to make it{" "}
            <span className="font-semibold text-[#6d6fff]">easy for everyone</span> to find and participate.
          </p>
        </section>

        {/* How to Use the Site */}
        <section className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-4xl font-bold text-[#6d6fff] mb-2 text-center">How to Use the Site</h2>
          <ul className="space-y-4 ">
            {[
              "Sign up and create your personal profile.",
              "Discover and join events in your city.",
              "Create events on topics that matter to you.",
              "Explore event categories like music, sports, workshops, and networking.",
              "Connect with other attendees through chats and forums.",
              "Join virtual events happening from anywhere.",
              "Have fun and be happy."
            ].map((text, index) => (
              <li key={index} className="flex items-center text-gray-700 text-xl text-center ">
                <FaCheckCircle className="text-[#6d6fff] mr-3 text-xl" />
                {text}
              </li>
            ))}
          </ul>
        </section>
      </div>

    </div>
  );
};

export default About;
