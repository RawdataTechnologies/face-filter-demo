import { create } from "zustand";
import { RefObject } from "react";

interface BaseStore {
  isCountDown: boolean;
  isThumbInfoActive: boolean;
  isImageLoaded: boolean;
  isWarningActive: boolean;
  isUserPresent: boolean;
  isUserActive: boolean;
  errorTrigger: string;
  isCamActive: boolean;
  setIsCountDown: (isCountDown: boolean) => void;
  setIsCamActive: (isCamActive: boolean) => void;
  setErrorTrigger: (errorTrigger: string) => void;
  setIsThumbInfoActive: (isThumbActive: boolean) => void;
  setIsImageLoaded: (isImageLoaded: boolean) => void;
  setIsWarningActive: (isWarningActive: boolean) => void;
  setIsUserPresent: (isUserPresent: boolean) => void;
  setIsUserActive: (isUserPresent: boolean) => void;
  videoRef: RefObject<HTMLVideoElement> | null;
  canvasRef: RefObject<HTMLCanvasElement> | null;
  setVideoRef: (ref: RefObject<HTMLVideoElement>) => void;
  setCanvasRef: (ref: RefObject<HTMLCanvasElement>) => void;
}

const baseStore = create<BaseStore>((set) => ({
  videoRef: null,
  canvasRef: null,
  isCountDown: false,
  isThumbInfoActive: true,
  isImageLoaded: false,
  isWarningActive: false,
  isUserPresent: true,
  isUserActive: true,
  errorTrigger: "",
  isCamActive: false,

  setVideoRef: (ref) => set(() => ({ videoRef: ref })),
  setCanvasRef: (ref) => set(() => ({ canvasRef: ref })),
  setIsCountDown: (isCountDown: boolean) => set({ isCountDown }),
  setIsCamActive: (isCamActive: boolean) => set({ isCamActive }),
  setErrorTrigger: (errorTrigger: string) => set({ errorTrigger }),
  setIsThumbInfoActive: (isThumbActive: boolean) =>
    set({ isThumbInfoActive: isThumbActive }),
  setIsImageLoaded: (isImageLoaded: boolean) => set({ isImageLoaded }),
  setIsWarningActive: (isWarningActive: boolean) => set({ isWarningActive }),
  setIsUserPresent: (isUserPresent: boolean) => set({ isUserPresent }),
  setIsUserActive: (isUserActive: boolean) => set({ isUserActive }),
}));

export default baseStore;
