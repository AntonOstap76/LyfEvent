import { useState } from "react";
import CloseIcon from "./CloseIcon";

const FactsModal = ({ closeModal, Fact, updateFact }) => {
  const [fact, setFact] = useState(Fact);

  const handleDone = () => {
    updateFact(fact);
    closeModal();
  };

  return (
    <div className="relative z-10" role="dialog" aria-modal="true">
      <div className="fixed inset-0  bg-opacity-80 transition-all backdrop-blur-sm"></div>
      <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md ring-2 ring-black bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-black text-lg font-bold">Adding a Fact</h2>
              <button
                onClick={closeModal}
                type="button"
                className="rounded-md p-1 inline-flex items-center justify-center text-gray-400 hover:bg-gray-200 focus:outline-none"
              >
                <span className="sr-only">Close menu</span>
                <CloseIcon />
              </button>
            </div>
            <div className="mt-4">
              <textarea
                className="border border-gray-300 p-2 w-full h-48 rounded-lg resize-none"
                placeholder="Write your fact here..."
                value={fact}
                onChange={(e) => setFact(e.target.value)}
              />
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 text-center">
            <button
              onClick={handleDone}
              className="bg-customBlue-500 text-white px-8 py-2 rounded-md hover:bg-blue-600 transition text-lg font-bold"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactsModal;