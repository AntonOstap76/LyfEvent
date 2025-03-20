import { useState, useEffect } from "react";
import CloseIcon from "./CloseIcon";
import { Link } from "react-router-dom";

const JoinedModal = ({ closeModal, events, profile }) => {
  const [search, setSearch] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };
  
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  

  useEffect(() => {
    // Separate hosted and joined events
    const hostedEvents = events.filter(event => event.host.id === profile.user.id);
    const joinedEvents = events.filter(event => event.host.id !== profile.user.id);

    // Set initial sorted events
    setFilteredEvents([...hostedEvents, ...joinedEvents]);
  }, [events, profile.user.id]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);

    // Filter events by search query
    const filtered = events.filter((event) =>
      event.title.toLowerCase().includes(query)
    );

    // Separate hosted and joined events
    const hostedEvents = filtered.filter(event => event.host.id === profile.user.id);
    const joinedEvents = filtered.filter(event => event.host.id !== profile.user.id);

    setFilteredEvents([...hostedEvents, ...joinedEvents]);
  };

  return (
    <div className="relative z-10" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-opacity-80 transition-all backdrop-blur-sm"></div>

      <div className="fixed inset-0 z-10 flex justify-center pt-12 pb-12">
        <div className="relative w-[90%] sm:w-[45%] min-h-[60vh] ring-2 ring-black rounded-2xl bg-white text-left shadow-xl transition-all overflow-auto">
          <div className="px-5 py-5">
            <h1 className="text-center text-xl font-bold">
              Events of {profile?.user?.username}
            </h1>

            <p className="text-center text-gray-500 mt-1">{events.length} event(s)</p>

            {/* Search Input */}
            <div className="border-b-2 py-4 px-2">
              <input
                type="text"
                placeholder="Search events"
                className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full text-black"
                value={search}
                onChange={handleSearch}
              />
            </div>

            {/* Events List */}
            <div className="mt-4">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <Link key={event.id} to={`/event/${event.id}`}>
                    <div className="flex items-center justify-between gap-3 p-2 hover:bg-customBlue-100 transition">
                      {/* Left side: Image & Title */}
                      <div className="truncate flex-1 flex items-center gap-3">
                        <img
                          src={event.image}
                          className="w-10 h-10 rounded-full"
                          alt="Event"
                        />

                        {event.host.id === profile.user.id ? (
                          <div className="flex flex-col gap-2 justify-between overflow-hidden whitespace-nowrap">
                            <span className="font-medium text-lg truncate">{event.title}</span>
                            <span className="text-xs text-center text-white bg-[#6d6fff] w-[45px] px-2 py-1 rounded-full">
                              Host
                            </span>
                          </div>
                        ) : (
                          <span className="font-medium text-lg truncate">{event.title}</span>
                        )}
                      </div>

                      {/* Right side: Date & Time */}
                      <div className="flex items-center gap-2 text-gray-600">
                        <div className="flex flex-col md:flex-row md:gap-2">
                          <span className="font-medium">
                            {new Intl.DateTimeFormat("en-GB", { dateStyle: "short" }).format(
                              new Date(event.date)
                            )}
                          </span>
                          {!isMobile && (
                            <span className="font-medium">|</span>
                          )}
                          <span className="font-medium">
                            {new Intl.DateTimeFormat("en-GB", { timeStyle: "short" }).format(
                              new Date(event.date)
                            )}
                          </span>
                        </div>
                      </div>

                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center text-gray-500">No events found</p>
              )}
            </div>

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
    </div>
  );
};

export default JoinedModal;