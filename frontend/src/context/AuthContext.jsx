import React, { createContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"
import { useNavigate } from 'react-router-dom'
import Swal from "sweetalert2";
// Create AuthContext
export const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {

  const navigate = useNavigate()

  const [authTokens, setAuthtokens] = useState(()=>localStorage.getItem("authTokens")  ? JSON.parse(localStorage.getItem('authTokens')) : null);
  const [user, setUser] = useState(()=>localStorage.getItem("authTokens")  ? jwtDecode(localStorage.getItem('authTokens')) : null);
  const [loading, setLoading] = useState(true)

  const loginUser = async (e) => {
    e.preventDefault()
    let response = await fetch ("/api/token/", {
        method : "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({'username':e.target.username.value, "password":e.target.password.value})
    })
    let data = await response.json()

    if (response.status ===200){
        setAuthtokens(data)
        setUser(jwtDecode(data.access))
        localStorage.setItem('authTokens', JSON.stringify(data))
        navigate('/my-profile')
    }
    else{
        alert("Something Went Wrong")
    }
    
  };

  const logoutUser = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setAuthtokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        navigate("/login");
        Swal.fire("Logged out!", "You have been logged out successfully.", "success");
      }
    });
  };


  const updateToken = async () => {
    if (!authTokens?.refresh) { // Ensure `authTokens` and `refresh` are valid
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch("/api/token-refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: authTokens.refresh }),
      });
  
      if (response.status === 200) {
        const data = await response.json(); // Parse the JSON response
        setAuthtokens(data); // Update tokens in state
        setUser(jwtDecode(data.access)); // Decode and set user
        localStorage.setItem("authTokens", JSON.stringify(data)); // Persist tokens
      } else {
        logoutUser(); // Logout if the refresh fails
      }
    } catch (error) {
      console.error("Token refresh failed:", error); // Log errors for debugging
      logoutUser(); // Logout on error
    } finally {
      setLoading(false); // Ensure loading state is updated
    }
  };
  


  const authContextData = {
    user:user, 
    authTokens:authTokens,
    loading:loading,
    loginUser:loginUser, 
    logoutUser:logoutUser,

  } 

  useEffect(()=>{
    
    if(loading){
      updateToken()
    }
   
   let fourMin = 1000 * 60 * 4
   let interval =  setInterval(()=>{
    if(authTokens){
        updateToken()
    }
    }, fourMin)
    return ()=> clearInterval(interval)

  }, [authTokens, loading])

  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  );
};