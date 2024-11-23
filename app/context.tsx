"use client";

import { createContext, Dispatch, SetStateAction, useState } from "react";

interface GlobalContext {
  searchLoading: boolean;
  setSearchLoading?: Dispatch<SetStateAction<boolean>>;

  initialLoading: boolean;
  setInitialLoading?: Dispatch<SetStateAction<boolean>>;

  worker: Worker | null;
  setWorker?: Dispatch<SetStateAction<Worker | null>>;
}

const initialGlobalContext: GlobalContext = {
  searchLoading: false,
  initialLoading: false,
  worker: null,
};

export const GlobalContext = createContext<GlobalContext>(initialGlobalContext);

export default function ContextWrapper({ children }: any) {
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [worker, setWorker] = useState<Worker | null>(null);

  const globalContext = {
    searchLoading,
    setSearchLoading,
    worker,
    setWorker,
    initialLoading,
    setInitialLoading,
  };

  return (
    <GlobalContext.Provider value={globalContext}>
      {children}
    </GlobalContext.Provider>
  );
}
