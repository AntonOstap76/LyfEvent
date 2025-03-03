import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

let ASPECT_RATIO = 4 / 3;
let MIN_DIMENSION = 1500;

const ImageCroper = ({ imageSrc , updatePic, closeModal}) => {

  const [crop, setCrop] = useState(null);


  const imgRef = useRef(null)

  const canvasRef =useRef(null)

  const handleCropChange = (newCrop) => {
    setCrop(newCrop);
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const cropInPercent = (MIN_DIMENSION / width) * 100;
    const crop = makeAspectCrop({ unit: '%', width: cropInPercent }, ASPECT_RATIO, width, height);
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  // const handleSaveClick = () => {
  //   if (canvasRef.current && imgRef.current) {
  //     setCanvas(
  //       imgRef.current,
  //       canvasRef.current,
  //       convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height)
  //     );
  //     const dataURL = canvasRef.current.toDataURL();
  //     console.log("Cropped Image:", dataURL);  // Log the cropped image as a data URL
  //     addImage(dataURL);
  //     closeModal()
  // };}


  const handleSaveClick = () => {
    if (canvasRef.current && imgRef.current && crop) {
      setCanvas(
        imgRef.current,
        canvasRef.current,
        convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height)
      );
      const dataURL = canvasRef.current.toDataURL();
  
      updatePic(dataURL);
      closeModal(); 
    }
  };
  
  const setCanvas = (
    image, // HTMLImageElement
    canvas, // HTMLCanvasElement
    crop // PixelCrop
  ) => {
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
            aspect={ASPECT_RATIO}
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Upload"
              style={{ maxHeight: '70vh' }}
              onLoad={onImageLoad}
            />
          </ReactCrop>

          <button
            onClick={handleSaveClick}
            className="text-white  text-lg py-3 px-6 rounded-3xl mt-4 bg-customBlue-500 hover:bg-customBlue-600"
            >
            Save
        </button>
        </div>
      )}

   
        <canvas
          ref={canvasRef}
          className="mt-4"
          style={{
            display: "none",
            border: "1px solid black",
            objectFit: "contain",
            width: 150,
            height: 150,
          }}
        />


    </>
  );
};

export default ImageCroper;
