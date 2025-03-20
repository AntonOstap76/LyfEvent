import React, { useState } from 'react';
import { useFormik } from 'formik';
import registerSchema from '../schemas/RegisterValidator';
import { useNavigate } from 'react-router-dom';
import ModalRegister from '../components/ModalRegister';

const Register = () => {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password1: '',
      password2: '',
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
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

                <button
                  type="submit"
                  className="w-full text-white bg-customBlue-600 hover:bg-customBlue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 mr-2 text-white animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5C100 77.614 77.614 100 50.5 100S1 77.614 1 50.5 22.886 1 50.5 1c10.16 0 19.776 2.983 27.796 8.088"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </button>

                <p className="text-sm font-light text-gray-500">
                  Already have an account?{' '}
                  <a href="/login" className="font-medium text-customBlue-600 hover:underline">
                    Sign In
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>

        {modal && <ModalRegister close={() => navigate('/login/')} />}
      </section>
    </div>
  );
};

export default Register;
