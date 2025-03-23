import React, { useState } from 'react';
import { useFormik } from 'formik';
import registerSchema from '../schemas/RegisterValidator';
import { useNavigate } from 'react-router-dom';
import ModalRegister from '../components/ModalRegister';
import Consents from '../components/Consents';

const Register = () => {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [consentModal, setConsentModal] = useState(false);
  const [error, setError] = useState(false); // Track consent error

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password1: '',
      password2: '',
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      if (!consent) {
        setError(true); // Show error if consent is not checked
        return;
      }

      setLoading(true);
      const finalData = { ...values };

      try {
        const response = await fetch('/api/register/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalData),
        });

        if (response.ok) {
          setModal(true);
        } else {
          console.error('Unknown error');
        }
      } catch (error) {
        console.error('Network Error:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div>
      <section className="min-h-screen bg-white">
        <div className="flex flex-col items-center px-6 py-8 mx-auto lg:py-0">
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                Sign Up
              </h1>

              <form className="space-y-4 md:space-y-6" onSubmit={formik.handleSubmit}>
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your email"
                    className={`bg-gray-50 border text-gray-900 rounded-lg block w-full p-2.5 ${
                      formik.errors.email && formik.touched.email
                        ? 'border-red-600 focus:border-red-600 focus:ring-red-600'
                        : 'border-gray-300 focus:border-customBlue-600 focus:ring-customBlue-600'
                    }`}
                  />
                  {formik.errors.email && formik.touched.email && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.email}</p>
                  )}
                </div>

                {/* Username Field */}
                <div>
                  <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Enter your username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`bg-gray-50 border text-gray-900 rounded-lg block w-full p-2.5 ${
                      formik.errors.username && formik.touched.username
                        ? 'border-red-600 focus:border-red-600 focus:ring-red-600'
                        : 'border-gray-300 focus:border-customBlue-600 focus:ring-customBlue-600'
                    }`}
                  />
                  {formik.errors.username && formik.touched.username && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.username}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password1" className="block mb-2 text-sm font-medium text-gray-900">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password1"
                    id="password1"
                    placeholder="••••••••"
                    value={formik.values.password1}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`bg-gray-50 border text-gray-900 rounded-lg block w-full p-2.5 ${
                      formik.errors.password1 && formik.touched.password1
                        ? 'border-red-600 focus:border-red-600 focus:ring-red-600'
                        : 'border-gray-300 focus:border-customBlue-600 focus:ring-customBlue-600'
                    }`}
                  />
                  {formik.errors.password1 && formik.touched.password1 && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.password1}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="password2" className="block mb-2 text-sm font-medium text-gray-900">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="password2"
                    id="password2"
                    placeholder="••••••••"
                    value={formik.values.password2}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`bg-gray-50 border text-gray-900 rounded-lg block w-full p-2.5 ${
                      formik.errors.password2 && formik.touched.password2
                        ? 'border-red-600 focus:border-red-600 focus:ring-red-600'
                        : 'border-gray-300 focus:border-customBlue-600 focus:ring-customBlue-600'
                    }`}
                  />
                  {formik.errors.password2 && formik.touched.password2 && (
                    <p className="text-red-600 text-sm mt-1">{formik.errors.password2}</p>
                  )}
                </div>

                {/* Consent Checkbox */}
                <div className="mt-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-red-500 font-bold text-lg">*</span> {/* Star near the checkbox */}
                    <input
                      type="checkbox"
                      id="terms"
                      className="w-5 h-5 accent-blue-600 cursor-pointer"
                      checked={consent}
                      onChange={() => {
                        setConsent(!consent);
                        setError(false); // Remove error when checked
                      }}
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700 flex items-center cursor-pointer">
                      I agree to the  
                      <button
                        type="button" // Prevents form submission
                        onClick={() => setConsentModal(true)}
                        className="text-customBlue-600 hover:underline ml-1"
                      >
                        Terms and Consents
                      </button>
                    </label>
                  </div>

                  {/* Error message if checkbox is not checked */}
                  {error && <p className="text-red-600 text-sm mt-1">You must agree to the terms to proceed</p>}
                </div>

                {/* Terms and Consents Modal */}
                {consentModal && <Consents closeModal={() => setConsentModal(false)} />}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full text-white bg-customBlue-600 hover:bg-customBlue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Sign Up"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Registration Success Modal */}
        {modal && <ModalRegister close={() => navigate('/login/')} />}
      </section>
    </div>
  );
};

export default Register;
