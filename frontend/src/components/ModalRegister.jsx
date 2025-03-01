import React from 'react';
import CloseIcon from "./CloseIcon";

const ModalRegister = ({ close }) => {
    return (
        <div className="relative z-10" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
            
            <div className="fixed inset-0 flex items-center justify-center">
                <div className="relative w-[90%] max-w-md min-h-[40vh] ring-2 ring-black rounded-2xl bg-white text-center shadow-xl p-6 overflow-auto">
                    <h1 className="text-xl font-bold">Confirm Email</h1>
                    <p className="mt-4 text-gray-700">
                        Before signing in, confirm your email first. We sent a link to your email,
                        click on it, and then sign in.
                    </p>

                    <a href="https://mail.google.com/" className='text-customBlue-600 hover:underline hover:cursor-pointer'>
                      <p className='mt-2'>
                        Go to my Emails
                      </p>
                    </a>
                    
                    <button
                        onClick={close}
                        className="mt-8 bg-customBlue-600 text-white px-6 py-2 rounded-md hover:bg-customBlue-700 focus:outline-none"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalRegister;
