import React from "react";

const Consents = ({ closeModal }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Terms and Consents</h2>
          <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
            ✖
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          
          {/* 1. Terms of Service */}
          <div>
            <h3 className="font-medium">1. Terms of Service</h3>
            <p className="text-sm text-gray-600">
              By using this service, you agree to comply with our terms and conditions, 
              including but not limited to acceptable use, content restrictions, and 
              user responsibilities. Violation of these terms may result in account suspension or termination.
            </p>
          </div>

          {/* 2. Privacy Policy */}
          <div>
            <h3 className="font-medium">2. Privacy Policy</h3>
            <p className="text-sm text-gray-600">
              We collect and process personal data in accordance with our Privacy Policy. Your information is stored securely, 
              and we do not share it with third parties without your consent, except where required by law.
            </p>
          </div>

          {/* 3. Email Verification Consent */}
          <div>
            <h3 className="font-medium">3. Email Verification Consent</h3>
            <p className="text-sm text-gray-600">
              To ensure security and prevent fraudulent activities, we require email verification during registration. 
              By signing up, you agree to receive a verification email and confirm your email address before accessing certain features.
            </p>
          </div>

          {/* 4. Marketing and Communication Consent */}
          <div>
            <h3 className="font-medium">4. Marketing and Communication Consent</h3>
            <p className="text-sm text-gray-600">
              By opting in, you agree to receive promotional emails and updates about our services. 
              You can unsubscribe at any time.
            </p>
          </div>

          {/* 5. GDPR and Data Processing Agreement */}
          <div>
            <h3 className="font-medium">5. GDPR Compliance & Data Processing Agreement</h3>
            <p className="text-sm text-gray-600">
              We process your data in compliance with GDPR and applicable regulations. 
              You have the right to access, modify, or delete your personal data upon request. 
              If you have concerns about how your data is used, please contact us.
            </p>
          </div>

          {/* 6. Cookies Policy */}
          <div>
            <h3 className="font-medium">6. Cookies Policy</h3>
            <p className="text-sm text-gray-600">
              We use cookies to enhance your experience. By continuing to use our website, 
              you agree to our use of cookies. You can manage cookie preferences in your browser settings.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end">
          <button onClick={closeModal} className="px-4 py-2 bg-customBlue-600 text-white rounded-lg hover:bg-customBlue-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Consents;
