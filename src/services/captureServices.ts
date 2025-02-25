import { createMediaStreamSource, Transform2D } from "@snap/camera-kit";
import { useCallback } from "react";
import filterStore from "../store/filterStore";
import { useNavigate } from "react-router";

function useCaptureServices() {
  const navigate = useNavigate();
  const session = filterStore((state) => state.session);
  const addImage = filterStore((state) => state.addImage);

  const startCameraKit = useCallback(async () => {
    if (window.navigator != null) {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      const source = createMediaStreamSource(mediaStream, {
        transform: Transform2D.MirrorX,
      });

      if (session) {
        session.output.live.className =
          "border w-full h-full  md:w-[500px] md:h-[500px] object-cover rounded-lg shadow-md m-auto p-4 border-none";
        session.setSource(source);

        session.play("live");
      }
    }
  }, [session]);

  const startCamera = async (canvasRef: React.RefObject<HTMLCanvasElement>) => {
    try {
      await startCameraKit();
      if (session) {
        const liveVideo = session.output.live;

        canvasRef.current?.replaceWith(liveVideo);

        return liveVideo.captureStream() as MediaStream;
      }
    } catch (error) {
      console.log("camera kit init error", error);
    }
  };

  const captureImage = useCallback(
    (
      canvasRef: React.RefObject<HTMLCanvasElement>,
      videoRef: React.RefObject<HTMLVideoElement>
    ) => {
      if (canvasRef.current && videoRef.current) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        // video.className = "w-[899px] h-[947px]";

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext("2d");
        if (context) {
          context.imageSmoothingEnabled = true;
          context.imageSmoothingQuality = "high";
          const cropWidth = video.videoWidth * 0.72; // Capture 72% of the width
          const cropHeight = video.videoHeight * 0.9; // Capture 90% of the height
          const cropX = (video.videoWidth - cropWidth) / 2; // Center the crop horizontally
          const cropY = (video.videoHeight - cropHeight) / 2; // Center the crop vertically

          // Adjust canvas size to match cropped area
          const aspectRatio = cropWidth / cropHeight;
          canvas.height = canvas.width / aspectRatio;

          // Draw the cropped area onto the canvas
          context.drawImage(
            video as CanvasImageSource,
            cropX,
            cropY,
            cropWidth,
            cropHeight, // Source region (crop)
            0,
            0,
            canvas.width,
            canvas.height 
          );
          const imageUrl = canvas.toDataURL("image/png");
          console.log("img url >> ", imageUrl);
          addImage(imageUrl);
          navigate("/preview");
          if (videoRef.current) {
            videoRef.current.srcObject = null;
          }
        }
      }
    },
    []
  );

  return { startCamera, captureImage };
}

export default useCaptureServices;
