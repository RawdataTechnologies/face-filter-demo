import { CameraKitSession, Lens } from "@snap/camera-kit";
interface CameraKitState {
  session: CameraKitSession | null;
  lenses: Lens[] | null;
}

export type { CameraKitState };
