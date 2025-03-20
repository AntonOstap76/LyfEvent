import { useState, useEffect } from "react";
import CloseIcon from "./CloseIcon";
import { Link } from "react-router-dom";

const ModalEvents = ({ selectedEvent, closeModal }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative z-50" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-opacity-80 transition-all backdrop-blur-sm"></div>

      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 flex justify-center pt-24 pb-12">
        {/* SIDEBAR RIGHT 1 */}
        <div className="mx-auto w-[42vh] h-auto mt-10 bg-white shadow-md ring-2 ring-black rounded-lg flex flex-col relative p-4 mb-3 overflow-auto">
          <h1 className="flex-1 flex justify-center text-2xl font-bold text-black mb-2">
            {selectedEvent.title}
          </h1>

          <img
            src={selectedEvent.image}
            className="w-[80%] h-auto mx-auto rounded-md object-cover shadow-md"
            alt="Event's name"
          />

          {selectedEvent && (
            <div className="mt-4 space-y-1 text-gray-700">
              <p className="text-lg font-medium">
                <span className="font-bold text-black">Location:</span> {selectedEvent.location}
              </p>
              <p className="text-lg font-medium">
                <span className="font-bold text-black">Date:</span>{" "}
                {new Intl.DateTimeFormat("en-GB", { dateStyle: "short" }).format(new Date(selectedEvent.date))}
              </p>
              <p className="text-lg font-medium">
                <span className="font-bold text-black">Time:</span>{" "}
                {new Intl.DateTimeFormat("en-US", { timeStyle: "short" }).format(new Date(selectedEvent.date))}
              </p>
            </div>
          )}



          <Link to={`/event/${selectedEvent.id}`} className="mt-auto">
            <button className="w-full bg-[#6d6fff] text-white py-2 mt-2 rounded-lg text-lg font-semibold shadow-lg hover:bg-gray-800 transition duration-300">
              See All Info
            </button>
          </Link>

                  {/* Close Button */}
        <button
          onClick={closeModal}
          type="button"
          className="rounded-md p-1 inline-flex items-center justify-center text-gray-400 hover:bg-gray-700 focus:outline-none absolute top-2 right-2"
        >
          <span className="sr-only">Close menu</span>
          <CloseIcon />
        </button>
        </div>


      </div>
    </div>
  );
};

export default ModalEvents;
