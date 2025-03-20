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
                        We sent a  link to your email.
                        Click on it and your email will be verified.
                        Before signing in, please verify your email.
                        P.S. Check the spam, if you can't find the email.
                    </p>

                    
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
