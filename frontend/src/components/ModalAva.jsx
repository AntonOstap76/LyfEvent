import CloseIcon from "./CloseIcon";
import AvaCroper from "./AvaCroper"

const ModalAva = ({ closeModal, imageSrc , updatePic}) => {
  return (
    <div
      className="relative z-10"
      aria-labelledby="crop-image-dialog"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-all backdrop-blur-sm">
        
      </div>
      <div className="fixed inset-0 z-10 flex justify-center pt-12 pb-12">
        <div className="relative w-[95%] sm:w-[80%] min-h-[60vh] rounded-2xl bg-gray-800 text-slate-100 text-left shadow-xl transition-all">
          <div className="px-5 py-5">

            <AvaCroper  imageSrc={imageSrc} closeModal={closeModal} updatePic={updatePic} />


            <button
            onClick={closeModal}
              type="button"
              className="rounded-md p-1 inline-flex items-center justify-center text-gray-400 hover:bg-gray-700 focus:outline-none absolute top-2 right-2"
              
            >
              <span className="sr-only">Close menu</span>
              <CloseIcon />
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalAva;