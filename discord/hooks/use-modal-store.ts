import { create } from "zustand";

export type ModalType = "createServer";

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false, type: null }),
  onOpen: (type) => set({ isOpen: true, type }),
  type: null,
}));