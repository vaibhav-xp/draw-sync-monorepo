import { useContext } from "react";
import { StoreContext } from "@/store";

/**
 * Custom hook to access the store context
 * @returns The store context with state and actions
 * @throws Error if used outside of StoreContextProvider
 */
export const useStore = () => {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error("useStore must be used within a StoreContextProvider");
  }

  return context;
};
