import { Permission, Server } from "@prisma/client";
import { create } from "zustand";

// invitation = recap_4

export type ModalType =
  | "createServer"
  // recap_4
  | "invite";

interface ModalData {
  // recap_4
  server?: Server;
  isPermitted?: boolean;
}

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  // recap_4
  data: ModalData;
  onOpen: (type: ModalType, data?: ModalData) => void;

  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  isOpen: false,
  // recap_4
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),

  onClose: () => set({ isOpen: false, type: null }),
  type: null,
}));
