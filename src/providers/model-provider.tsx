"use client";

import { Agency, User } from "@prisma/client";
import { FC, ReactNode, createContext, useEffect, useState } from "react";

interface ModelProviderProps {
  children: ReactNode;
}

export type ModalData = {
  user?: User;
  agency?: Agency;
};

//create a context type

type ModelContextType = {
  data: ModalData;
  isOpen: boolean;
  setOpen: (modal: ReactNode, fetchData?: () => Promise<any>) => void;
  setClose: () => void;
};

//put initial value of context
export const ModalContext = createContext<ModelContextType>({
  data: {},
  isOpen: false,
  setOpen: (modal: ReactNode, fetchData?: () => Promise<any>) => {},
  setClose: () => {},
});

//modal provider - use this provider to wrap the app to use the modal context in the app level
const ModalProvider: FC<ModelProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ModalData>({}); //data to be passed to the modal
  const [showingModel, setShowingModel] = useState<ReactNode>(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  const setOpen = async (modal: ReactNode, fetchData?: () => Promise<any>) => {
    if (modal) {
      if (fetchData) {
        setData({ ...data, ...((await fetchData()) || {}) }); //fetch data and set it to the modal
      }
      setShowingModel(modal);
      setIsOpen(true);
    }
  };

  const setClose = () => {
    setIsOpen(false);
    setData({});
  };

  if (!isMounted) return null;

  return (
    <ModalContext.Provider
      value={{
        data,
        isOpen,
        setOpen,
        setClose,
      }}
    >
      {children}
      {showingModel}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
