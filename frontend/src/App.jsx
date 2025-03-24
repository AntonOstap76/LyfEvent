import './App.css'
import { useState, useEffect } from 'react'; // Import hooks here
import Header from './components/Header'
import EventsPage from './pages/EventsPage'
import EventPage from './pages/EventPage'
import Home from './pages/Home'
import CreateEventPage from './pages/CreateEventPage'
import About from './pages/About'
import Footer from './components/Footer'
import LoginPage from './pages/LoginPage'
import "react-image-crop/dist/ReactCrop.css";
import PrivateRoute from "./utils/PrivateRoute"
import { AuthProvider } from "./context/AuthContext"
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Profile from './pages/Profile'
import MyEvents from './pages/MyEvents'
import EventsFiltered from './pages/EventsFiltered'
import MyProfile from './pages/MyProfile'
import Register from './pages/Register'
import AllChats from './components/AllChats'
import ContactPage from './pages/Contact'
import ActivateEmail from './components/ActivateEmail'
import PasswordUpdate from './pages/ForgotPassword'

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <AuthProvider>
          <Header />
          <AppRoutes isMobile={isMobile} />
        </AuthProvider>
      </div>
    </Router>
  );
}

function AppRoutes({ isMobile }) {
  const location = useLocation(); // useLocation should be inside the Router context

  // Define the paths where Footer should be excluded
  const excludeFooterPaths = [  

  ];

  // Check if the current path matches any excluded path or starts with any excluded path
  const shouldShowFooter = !excludeFooterPaths.some((path) => location.pathname.startsWith(path));

  const shouldRenderFooter = shouldShowFooter && !isMobile;

  return (
    <>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/event/:id" element={<EventPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events-search" element={<EventsFiltered />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-event/*" element={<PrivateRoute element={<CreateEventPage />} />} />
        <Route path="/my-profile/*" element={<PrivateRoute element={<MyProfile />} />} />
        <Route path="/profile/*" element={<PrivateRoute element={<Profile />} />} />
        <Route path="/chat/*" element={<PrivateRoute element={<AllChats />} />} />
        <Route path="/my-events/*" element={<PrivateRoute element={<MyEvents />} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/activate" element={<ActivateEmail />} />
        <Route path="/password-update" element={<PasswordUpdate />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>

      {shouldRenderFooter && <Footer />}
    </>
  );
}

export default App;
