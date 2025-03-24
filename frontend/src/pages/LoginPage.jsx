import React, {useContext}from 'react';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  let {loginUser} = useContext(AuthContext)
  return (
    <div>
      <section className="min-h-screen bg-white">
        <div className="flex flex-col items-center  px-6 py-8 mx-auto lg:py-0">
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={loginUser}>
              <div>
                <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900"
                >
                    Username
                </label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-customBlue-500 focus:border-customBlue-500 block w-full p-2.5"
                    placeholder="Enter your username"
                    required
                />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-customBlue-500 focus:border-customBlue-500 block w-full p-2.5"
                    required
                  />
                </div>
                <div className="flex items-center justify-between">

                  <a
                    href="/password-update"
                    className="text-sm font-medium text-customBlue-600 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                
                <button
                  type="submit"
                  className="w-full text-white bg-customBlue-600 hover:bg-customBlue-700 focus:ring-4 focus:outline-none focus:ring-customBlue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Sign in
                </button>

                <p className="text-sm font-light text-gray-500">
                  Don’t have an account yet?{' '}
                  <a
                    href="/register"
                    className="font-medium text-customBlue-600 hover:underline"
                  >
                    Sign up
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
