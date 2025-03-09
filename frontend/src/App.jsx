import './App.css'
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

import {AuthProvider} from "./context/AuthContext"

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Profile from './pages/Profile'
import MyEvents from './pages/MyEvents'
import EventsFiltered from './pages/EventsFiltered'
import MyProfile from './pages/MyProfile'
import Register from './pages/Register'
import AllChats from './components/AllChats'


function App() {

  return (
    <Router>
      <div className='App'>
        <AuthProvider>
          <Header />
          
          <Routes>
            <Route path='/' exact element={<Home />} />
            <Route path='/event/:id' element={<EventPage />}/>
            <Route path='/events' element={<EventsPage />}/>
            <Route path='/events-search' element={<EventsFiltered />}/>
            
            <Route path='/about' element={<About/>}/>

            <Route path='/register' element={<Register/>}/>

            <Route path='/create-event/*' element={
              <PrivateRoute element={<CreateEventPage/>}/>
            }/>

            <Route path='/my-profile/*' element={
              <PrivateRoute element={<MyProfile/>}/>
            }/>

            <Route path='/profile/*' element={
              <PrivateRoute element={<Profile/>}/>
            }/>


            <Route path='/chat/*' element={
              <PrivateRoute element={<AllChats/>}/>
            }/>


            <Route path='/my-events/*' element={
              <PrivateRoute element={<MyEvents/>}/>
            }/>

            <Route path='/login' element={<LoginPage />}/>
          </Routes>
          </AuthProvider>

          <footer >
            <Footer />
          </footer>


      </div>
    </Router>
  )
}

export default App
