import React, {useEffect} from "react";
import { FaCheckCircle } from "react-icons/fa";
import logo from "../assets/logo/logo.svg";
import { useLocation } from 'react-router-dom';

const About = () => {
  const location = useLocation(); // To track the current location and URL

  useEffect(() => {
    // Check if the URL contains the hash for 'how-to-use'
    if (location.hash === '#how-to-use') {
      const section = document.getElementById('how-to-use');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.hash]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center space-y-12">
      
      {/* Hero Section */}
      <div className="w-full bg-[#6d6fff] text-white py-16 text-center shadow-lg">
        <h1 className="text-5xl font-extrabold mb-4">About Us</h1>
        <p className="font-semibold text-3xl">
          We connect people to meaningful events
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
            Our platform allows users to easily{" "}
            <span className="font-semibold text-[#6d6fff]">find and create </span>{" "}
            events on topics they love. This project is our initiative to build something meaningful.
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
            that matter most to them. Whether it’s a concert, any sport, or a networking event, 
            we strive to make it{" "}
            <span className="font-semibold text-[#6d6fff]">easy for everyone</span> to find and participate.
          </p>
        </section>

        <section id="how-to-use" className="bg-white p-8 rounded-lg shadow-lg">
  <h2 className="text-4xl font-bold text-[#6d6fff] mb-6 text-center">How to Use</h2>
  <ul className="space-y-4">
    {[
      "Create an account and complete your profile.",
      "Explore and join events happening in your city.",
      "Search for different event by categories like music, sport, art,  etc.",
      "Host your own events on topics that interest you.",
      "As a student, you can join and create both regular events and exclusive student-only events.",
      "Interact with other participants through event chat.",
      "Follow others to see what events they are joined in.",
      "Enjoy yourself and make the most out of your experiences!"
    ].map((text, index) => (
      <li key={index} className="flex items-center text-gray-700 text-xl text-center">
        <span className="mr-2">{index + 1}.</span> {text}
      </li>
    ))}
  </ul>
</section>


      </div>

    </div>
  );
};

export default About;
