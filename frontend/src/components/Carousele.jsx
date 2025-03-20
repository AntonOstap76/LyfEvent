import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EventItem from "./EventItem";
import { Link } from 'react-router-dom';


const Carousele = ({ events }) => {
  if (events.length <2) return null;
  
  const settings = {
    dots: true,
    arrows: false, // Disable default arrows from slick-carousel
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 8000,
    pauseOnHover: true, 

  };

  const slider = React.useRef(null);



  return (
    <div className="slider-container w-full min-w-full max-w-full">
      <div className="flex justify-center ">
        <h1 className="text-center text-2xl font-bold pb-4">UPCOMING EVENTS</h1>
      </div>
      
      <Slider ref={slider} {...settings}>
        {events.map((event) => (
          <div key={event.id} className="w-full flex justify-center relative">
            <div className="w-full max-w-2xl">
              <EventItem event={event} />
            </div>

             {/* Buttons positioned on the left and right */}
      <div className="absolute top-1/3 left-0 transform -translate-y-1/2 ml-4">
        <button
          className="bg-white text-black p-2 rounded-full shadow-md"
          onClick={() => slider?.current?.slickPrev()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>
      </div>
  
      <div className="absolute top-1/3 right-0 transform -translate-y-1/2 mr-4 ">
        <button
          className="bg-white text-black p-2 rounded-full shadow-md"
          onClick={() => slider?.current?.slickNext()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
      

          </div>
        ))}

      </Slider>
  
      <div className="flex justify-center text-xl ">
          <a href="/events" className="underline text-customBlue-600 ">
            See more
          </a>
       
          <div>
          <Link 
          to="/about" 
          className="ml-4 underline text-customBlue-600"
        >
          How to use site
        </Link>
          </div>

          </div>

        


    </div>
  );
  
};

export default Carousele;
