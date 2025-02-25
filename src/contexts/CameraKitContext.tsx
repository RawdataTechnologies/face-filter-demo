import { bootstrapCameraKit, CameraKitSession, Lens } from "@snap/camera-kit";
import { createContext, useEffect, useRef, useState } from "react";
import { CameraKitState } from "../utils/types";
import filterStore from "../store/filterStore";

const apiToken = import.meta.env.VITE_PUBLIC_CAMERA_KIT_API_KEY;
const lensGroupIds = {
  hats: "c9deaf5c-d29d-4780-831a-501baa591d2b",
  lipsticks: "4aed1f7a-7f8a-4d99-b9d6-dea4c4d0995c",
  glasses: "5444bfbe-6dcb-4abc-986d-45c7edbf72cf",
};

// Extended context type to include lens group switching
interface ExtendedCameraKitState extends CameraKitState {
  changeLensGroup: (groupName: keyof typeof lensGroupIds) => Promise<void>;
  currentLensGroup: string;
}

export const CameraKitContext = createContext<ExtendedCameraKitState | null>(null);

export const CameraKit: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isInitialized = useRef<boolean>(false);
  const [session, setSession] = useState<CameraKitSession | null>(null);
  const [lenses, setLenses] = useState<Lens[]>([]);
  const [currentLensGroup, setCurrentLensGroup] = useState<string>("lipsticks");
  const [cameraKit, setCameraKit] = useState<any>(null);
  
  const setSnapSession = filterStore((state) => state.setSession);
  const setLens = filterStore((state) => state.setLens);
  
 
  const changeLensGroup = async (groupName: keyof typeof lensGroupIds) => {
    if (!cameraKit) return;
    
    try {
     
      const { lenses: newLenses } = await cameraKit.lensRepository.loadLensGroups([
        lensGroupIds[groupName]
      ]);
      
     
      await cameraKit.lensRepository.cacheLensContent(newLenses);
      
      
      setLenses(newLenses);
      setLens(newLenses);
      setCurrentLensGroup(groupName);
      
  
      if (newLenses.length > 0 && session) {
        session.applyLens(newLenses[0]);
      }
    } catch (error) {
      console.error("Error changing lens group:", error);
    }
  };
  
  useEffect(() => {
    if (apiToken) {
      try {
        const initializeCameraKit = async () => {
          const kit = await bootstrapCameraKit({ apiToken });
          setCameraKit(kit);
          
          const newSession = await kit.createSession({
            renderWhileTabHidden: true,
          });

        
          const { lenses: initialLenses } = await kit.lensRepository.loadLensGroups([
            lensGroupIds.lipsticks
          ]);
          await kit.lensRepository.cacheLensContent(initialLenses);

          setLenses(initialLenses);
          setSession(newSession);
          setSnapSession(newSession);
          setLens(initialLenses);
        };

        if (isInitialized.current) return;
        isInitialized.current = true;

        initializeCameraKit();
      } catch (error) {
        console.log(error, "error");
      }
    }
  }, []);

  useEffect(() => {
    try {
      if (session && lenses.length > 0) {
        session.applyLens(lenses[0]);
      }
    } catch (error) {
      console.log(error);
    }
  }, [lenses, session]);

  return !session ? (
    <></>
  ) : (
    <CameraKitContext.Provider 
      value={{ 
        session, 
        lenses, 
        changeLensGroup, 
        currentLensGroup 
      }}
    >
      {children}
    </CameraKitContext.Provider>
  );
};