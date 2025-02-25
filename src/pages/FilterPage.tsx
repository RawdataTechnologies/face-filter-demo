import React, { useEffect, useRef, useState } from "react";
import useCaptureServices from "../services/captureServices";
import filterStore from "../store/filterStore";
import { useNavigate } from "react-router";

const FilterPage = () => {
  const { startCamera, captureImage } = useCaptureServices();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentLensIndex, setcurrentLensIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const lensesContainerRef = useRef<HTMLDivElement>(null);
  const { session, lenses } = filterStore();
  console.log("Lenses >>>", lenses);
const navigate=useNavigate()
  // const filters = [
  //   { id: 1, name: "No Filter", icon: "😊", color: "bg-white" },
  //   { id: 2, name: "Dog", icon: "🐶", color: "bg-orange-400" },
  //   { id: 3, name: "Cat", icon: "🐱", color: "bg-gray-400" },
  //   { id: 4, name: "Heart", icon: "❤️", color: "bg-red-500" },
  //   { id: 5, name: "Star", icon: "⭐", color: "bg-yellow-400" },
  //   { id: 6, name: "Rainbow", icon: "🌈", color: "bg-purple-500" },
  //   { id: 7, name: "Alien", icon: "👽", color: "bg-green-400" },
  //   { id: 8, name: "Robot", icon: "🤖", color: "bg-blue-500" },
  // ];

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await startCamera(
          canvasRef as React.RefObject<HTMLCanvasElement>
        );
        if (videoRef.current) {
          videoRef.current.srcObject = stream as MediaProvider;
        }
      } catch (error) {
        console.error("Error starting camera:", error);
      }
    };

    initCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
        videoRef.current.srcObject = null;
      }
    };
  }, [startCamera]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    handleSwipe(currentX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    handleSwipe(currentX);
  };

  const handleSwipe = (currentX: number) => {
    if (!lenses) return;
    const diff = startX - currentX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentLensIndex < lenses.length - 1) {
        // Swipe left
        setcurrentLensIndex(currentLensIndex + 1);
      } else if (diff < 0 && currentLensIndex > 0) {
        // Swipe right
        setcurrentLensIndex(currentLensIndex - 1);
      }
      setIsDragging(false);
      setStartX(currentX); // Reset start position to prevent multiple swipes
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const selectLens = (index: number) => {
    setcurrentLensIndex(index);
    if (lenses) {
      session?.applyLens(lenses[index]);
    }
  };

  // Calculate which lenses to show in the carousel
  const visiblelenses = () => {
    if (!lenses) return [];
    const result = [];
    // Always show at least 5 lenses in the carousel
    const startIdx = Math.max(
      0,
      Math.min(currentLensIndex - 2, lenses.length - 5)
    );
    const endIdx = Math.min(startIdx + 5, lenses.length);

    for (let i = startIdx; i < endIdx; i++) {
      result.push(lenses[i]);
    }
    return result;
  };

  return (
    <>
      {lenses && lenses?.length > 0 && (
        <div className="bg-gradient-to-b from-yellow-300 to-yellow-500 w-screen h-screen flex items-center justify-center">
      

          <div className="relative w-full h-full md:w-72 md:h-[560px] bg-black rounded-none md:rounded-[35px] shadow-2xl border-0 md:border-4 border-black overflow-hidden">
            {/* <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[150px] h-[25px] bg-black rounded-b-[25px] z-10"></div> */}
            <div onClick={() => navigate("/")} className="absolute top-3 left-3 z-50 w-8 h-8"><img src="back-arrow.svg" alt="" /></div>
            <div className="absolute bottom-6 left-6 w-9 h-9 text-white text-xl cursor-pointer transform scale-x-[-1] z-10">
              <i className="fas fa-comment-alt"></i>
            </div>

            <div className="absolute bottom-6 right-10 w-6 h-9 text-white text-3xl cursor-pointer z-10"></div>

            {/* Current filter indicator */}

            <div
              onClick={() =>
                captureImage(
                  canvasRef as React.RefObject<HTMLCanvasElement>,
                  videoRef as React.RefObject<HTMLVideoElement>
                )
              }
              className="absolute bottom-14 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full border-4 border-white cursor-pointer hover:opacity-80 flex items-center justify-center z-10"
            >
              <span className="text-2xl">
                <img src={lenses[currentLensIndex].iconUrl} alt="" />
              </span>
            </div>

            <div className="absolute top-8 left-8 w-10 h-10 rounded-full text-white text-3xl text-center leading-[46px] cursor-pointer z-10">
              <i className="fas fa-user"></i>
            </div>

            {/* Filter swiper - original design with fixed visibility */}
            <div
              ref={lensesContainerRef}
              className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex space-x-3 transition-all duration-300 z-20 bg-black bg-opacity-30 px-4 py-2 rounded-full"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {lenses &&
                lenses.length > 0 &&
                visiblelenses().map((lens) => (
                  <button
                    key={lens.id}
                    className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                      lens.id === lenses[currentLensIndex].id
                        ? ` scale-125 border-2 border-white`
                        : "bg-gray-800 opacity-60"
                    }`}
                    onClick={() =>
                      selectLens(lenses.findIndex((f) => f.id === lens.id))
                    }
                  >
                    <span className="text-lg">
                      <img src={lens.iconUrl} alt="" />
                    </span>
                  </button>
                ))}
            </div>

            {/* Navigation indicators */}
            <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
              {lenses.map((_, index) => (
                <div
                  key={index}
                  className={`w-1 h-1 rounded-full ${
                    index === currentLensIndex ? "bg-white" : "bg-gray-500"
                  }`}
                />
              ))}
            </div>

            <video
              ref={videoRef}
              id="cam"
              autoPlay
              muted
              playsInline
              className="absolute top-0 left-0 w-full h-full object-cover"
            ></video>
            <canvas ref={canvasRef} id="canvas" className="hidden"></canvas>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterPage;
