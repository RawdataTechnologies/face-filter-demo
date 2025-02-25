import { CameraKitSession, Lens } from "@snap/camera-kit/";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CameraKitState } from "../utils/types";
export interface Image {
  url: string;
  key: number;
}
interface FilterStore extends CameraKitState {
  session: CameraKitSession | null;
  lenses: Lens[] | null;
  category: string | null;
  images: Image[];
  addImage: (url: string) => void;
  setSession: (session: CameraKitSession) => void;
  setLens: (lenses: Lens[]) => void;
  setCategory : (category: 'hats'|'lipsticks'|'glasses') => void
}

const filterStore = create<FilterStore>()(
  persist(
    (set) => ({
      session: null,
      lenses: null,
      category: 'glasses',
      images: [],
      addImage: (url: string) => set((state) => ({ images: [...state.images, { url, key: Date.now() }] })),
      setSession: (session: CameraKitSession) => set({ session }),
      setLens: (lenses: Lens[]) => set({ lenses }),
      setCategory: (category: string) => set({ category }),
    }),
    {
      name: "filter-store",
      partialize: (state) => ({ lenses: state.lenses }),
    }
  )
);

export default filterStore;
