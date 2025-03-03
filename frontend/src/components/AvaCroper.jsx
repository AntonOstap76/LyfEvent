import React, { useRef, useState } from 'react';
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ASPECT_RATIO = 1; // Circular crop
const MIN_DIMENSION = 150;

const AvaCroper = ({ imageSrc, updatePic, closeModal }) => {
  const [crop, setCrop] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  const handleCropChange = (newCrop) => {
    setCrop(newCrop);
  };
  

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };




  const handleSaveClick = () => {
    if (canvasRef.current && imgRef.current && crop) {
      setCanvas(
        imgRef.current,
        canvasRef.current,
        convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height)
      );
      const dataURL = canvasRef.current.toDataURL();
      setCroppedImageUrl(dataURL);
      updatePic(dataURL);
      closeModal();
    }
  };

  

  const setCanvas = (image, canvas, crop) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }
  
    const pixelRatio = window.devicePixelRatio;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
  
    canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio);
  
    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = "high";
    ctx.save();
  
    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;
  
    // Move the crop origin to the canvas origin (0,0)
    ctx.translate(-cropX, -cropY);
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
    );
  
    ctx.restore();
  };
  

  return (
    <>
      {imageSrc && (
        <div className="flex flex-col items-center">
          <ReactCrop
            crop={crop}
            onChange={handleCropChange}
            keepSelection
            circularCrop
            aspect={ASPECT_RATIO}
            minWidth={MIN_DIMENSION} // Ensure minimum size is applied correctly
            minHeight={MIN_DIMENSION} // Ensure minimum size is applied correctly
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Upload"
              style={{ maxHeight: '70vh'}}
              onLoad={onImageLoad}
            />
          </ReactCrop>

          <button
            onClick={handleSaveClick}
            className="text-white text-lg py-3 px-6 rounded-3xl mt-4 bg-customBlue-500 hover:bg-customBlue-600"
          >
            Save
          </button>
        </div>
      )}

      {croppedImageUrl && (
        <div className="mt-4">
          <h3>Cropped Image:</h3>
          <img src={croppedImageUrl} alt="Cropped" style={{ borderRadius: '50%' }} />
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="mt-4"
        style={{ display: 'none' }} 
      />
    </>
  );
};

export default AvaCroper;
