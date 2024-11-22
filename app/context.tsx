"use client";

import { createContext, Dispatch, SetStateAction, useState } from "react";

interface GlobalContext {
  searchLoading: boolean;
  setSearchLoading?: Dispatch<SetStateAction<boolean>>;

  worker: Worker | null;
  setWorker?: Dispatch<SetStateAction<Worker | null>>;
}

const initialGlobalContext: GlobalContext = {
  searchLoading: false,
  worker: null,
};

export const GlobalContext = createContext<GlobalContext>(initialGlobalContext);

export default function ContextWrapper({ children }: any) {
  const [searchLoading, setSearchLoading] = useState(false);
  const [worker, setWorker] = useState<Worker | null>(null);

  const globalContext = {
    searchLoading,
    setSearchLoading,
    worker,
    setWorker,
  };

  return (
    <GlobalContext.Provider value={globalContext}>
      {children}
    </GlobalContext.Provider>
  );
}