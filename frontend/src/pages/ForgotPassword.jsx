import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ResetLinkModal from "../components/ResetLinkModal"

const PasswordUpdate = () => {
  const location = useLocation();
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [linkModal, setLinkModal] = useState(false)
  const [success, setSuccess] = useState(null)
  const navigate = useNavigate()

  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newPassToken = params.get("token");
    setToken(newPassToken || false);
  }, [location]);

  // Regex for password validation
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{1,20}$/;

  const sendLink = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      const response = await fetch(`/api/reset-pass-link/?email=${encodeURIComponent(email)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send reset link");

      setLinkModal(true)

      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
  
    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
  
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
  
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{1,20}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be 1-20 characters long, include at least one uppercase letter, one number, and one special character (@$!%*?&)."
      );
      return;
    }
  
    try {
      const response = await fetch(`/api/update-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
  
      const data = await response.json();
      if (!response.ok) {throw new Error(data.error || "Failed to reset password")
        setSuccess(false)}
  
      setSuccess(true)
      setError(""); // Clear error message on success
    } catch (error) {
      setError(error.message);
    }
  };

  const handleClose = ()=> {
    setLinkModal(false)
    navigate('/login')
  }
  

  return (
    <div>
      <section className="min-h-screen bg-white">
        <div className="flex flex-col items-center px-6 py-8 mx-auto lg:py-0">
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
                Reset Password
              </h1>

                    {success === null && (
                    <form className="space-y-4 md:space-y-6">
                        {token ? (
                        <>
                            <div>
                            <label
                                htmlFor="new-password"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                New Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="new-password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-customBlue-500 focus:border-customBlue-500 block w-full p-2.5"
                                required
                            />
                            </div>

                            <div>
                            <label
                                htmlFor="confirm-password"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                name="confirm_password"
                                id="confirm-password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-customBlue-500 focus:border-customBlue-500 block w-full p-2.5"
                                required
                            />
                            </div>

                            {error && <p className="text-red-500">{error}</p>}

                            <button
                            type="submit"
                            onClick={resetPassword}
                            className="w-full text-white bg-customBlue-600 hover:bg-customBlue-700 focus:ring-4 focus:outline-none focus:ring-customBlue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                            Reset
                            </button>
                        </>
                        ) : (
                        <div>
                            <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 focus:border-customBlue-600 focus:ring-customBlue-600"
                            />
                            </div>

                            <button
                            type="button"
                            onClick={sendLink}
                            className="w-full text-white bg-customBlue-600 hover:bg-customBlue-700 font-medium rounded-lg mt-4 text-sm px-5 py-2.5 text-center"
                            >
                            Get Reset Link
                            </button>

                            {linkModal && <ResetLinkModal close={handleClose} />}
                        </div>
                        )}
                    </form>
                    )}

                    {/* Success Message */}
                    {success === true && (
                    <p className="text-customBlue-600 text-center font-semibold text-xl">
                        Password updated successfully! Now you can log in with your new password.<br />
                        <a href="/login" className="text-customBlue-600 underline">
                        Go to Login
                        </a>
                    </p>
                    )}

                    {/* Error Message */}
                    {success === false && (
                    <p className="text-red-500 text-center font-semibold">
                        Something went wrong. Try again or{" "}
                        <a href="#" className="text-customBlue-600 underline">
                        contact us
                        </a>.
                    </p>
                    )}

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PasswordUpdate;
