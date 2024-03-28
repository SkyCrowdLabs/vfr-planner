import { createContext } from "react";

export interface DialogState {
  createNewRouteVisible: boolean;
  setCreateNewRouteVisible: (s: boolean) => void;
  confirmResetVisible: boolean;
  setConfirmResetVisible: (s: boolean) => void;
}

export const DialogContext = createContext<DialogState>({
  createNewRouteVisible: false,
  setCreateNewRouteVisible: () => {},
  confirmResetVisible: false,
  setConfirmResetVisible: () => {},
});
