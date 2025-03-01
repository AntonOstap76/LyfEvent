import React, { useContext } from 'react';
import logo from "../assets/logo/logo.svg";
import { AuthContext } from '../context/AuthContext';
import ChatIcon from './ChatIcon';
import ProfileIcon from './ProfileIcon';

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <header>
        <nav className="bg-white border-gray-200 px-4 lg:px-6 py-3 mt-4 mb-2">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            {/* Logo */}
            <a href="/" className="flex items-center">
              <img src={logo} className="mr-3 h-14 sm:h-16" alt="Logo" />
            </a>

            {/* Navigation and Icons */}
            <div className="flex items-center lg:order-2">
              {/* Conditional rendering based on user */}
              {user ? (
                <>
                  <a
                    href="/chat"
                    className="flex items-center text-lg hover:bg-customBlue-300 rounded-lg px-5 py-2 lg:py-2.5 mr-2 transition-transform duration-200 transform scale-115 hover:scale-125"
                  >
                    {/* Increased size for the Chat Icon */}
                    <ChatIcon className="w-8 h-8" />
                  </a>

                  <a
                    href="/my-profile "
                    className="flex items-center text-lg hover:bg-customBlue-300 rounded-lg px-5 py-2 lg:py-2.5 mr-2 transition-transform duration-200 transform scale-115 hover:scale-125"
                  >
                    {/* Increased size for the Chat Icon */}
                    <ProfileIcon className="text-black" />
                  </a>

                </>
              ) : (
                <>
                  <a
                    href="/login"
                    className="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-lg px-5 py-2 mr-4 transition-all duration-200"
                  >
                    Log in
                  </a>

                  <a
                    href="/register"
                    className="text-white bg-customBlue-600 hover:bg-customBlue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 mr-4 transition-all duration-200"
                  >
                    Get started
                  </a>
                </>
              )}

              {/* Mobile menu button */}
              <button
                data-collapse-toggle="mobile-menu-2"
                type="button"
                className="inline-flex items-center p-2 ml-1 text-lg text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                aria-controls="mobile-menu-2"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>

            {/* Desktop navigation links */}
            <div
              className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
              id="mobile-menu-2"
            >
              <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                {[
                  { name: "Home", href: "/" },
                  { name: "Events", href: "/events" },
                  { name: "My Events", href: "/my-events" },
                  { name: "Create Event", href: "/create-event" },
                  { name: "About", href: "/about" },
                ].map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className={`block py-2 pr-4 pl-3 rounded text-lg ${
                        item.name === "Home"
                          ? "text-customBlue-600"
                          : "text-black"
                      } lg:bg-transparent lg:p-0 hover:bg-customBlue-700 hover:text-white`}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;
