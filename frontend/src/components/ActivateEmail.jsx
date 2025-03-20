import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ActivateEmail = () => {
  const [token, setToken] = useState(null);
  const [status, setStatus] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const activationToken = params.get('token');
    if (!activationToken) {
      navigate("/login/");
      return;
    }
    setToken(activationToken);
  }, [location, navigate]);

  useEffect(() => {
    if (token) {
      const activate = async () => {
        const response = await fetch(`/api/activate/${token}`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setStatus({ success: true, message: "Email activated successfully! Now you can log in." });

        } else {
          setStatus({ success: false, message: "Something went wrong. Please try again later." });
        }
      };

      activate();
    }
  }, [token, navigate]);

  return (
    <div className="flex justify-center  min-h-screen w-full ">
      <div className="bg-white p-8  max-w-md w-full ">
        {status ? (
          <div className={`text-center ${status.success ? 'text-customBlue-500' : 'text-red-500'}`}>
            <h2 className="text-2xl font-semibold mb-4">{status.message}</h2>
            {status.success === false && <p className="text-sm text-gray-600">Please try again or contact support if the issue stays.</p>}
          </div>
        ) : (
          <div className="text-center text-gray-600">Activating your account...</div>
        )}
      </div>
    </div>
  );
};

export default ActivateEmail;
