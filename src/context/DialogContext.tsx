"use client";
import { createContext } from "react";

export interface DialogState {
  createNewRouteVisible: boolean;
  setCreateNewRouteVisible: (s: boolean) => void;
  confirmResetVisible: boolean;
  setConfirmResetVisible: (s: boolean) => void;
}

interface DialogProviderProps {
  children: React.ReactNode;
  state: DialogState;
}

export const DialogContext = createContext<DialogState>({
  createNewRouteVisible: false,
  setCreateNewRouteVisible: () => {},
  confirmResetVisible: false,
  setConfirmResetVisible: () => {},
});

const DialogProvider: React.FC<DialogProviderProps> = ({ children, state }) => {
  return (
    <DialogContext.Provider value={state}>{children}</DialogContext.Provider>
  );
};
export default DialogProvider;
