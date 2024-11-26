"use client";

import { createContext, Dispatch, SetStateAction, useState } from "react";

interface GlobalContext {
  searchLoading: boolean;
  setSearchLoading?: Dispatch<SetStateAction<boolean>>;

  initialLoading: boolean;
  setInitialLoading?: Dispatch<SetStateAction<boolean>>;
}

const initialGlobalContext: GlobalContext = {
  searchLoading: false,
  initialLoading: false,
};

export const GlobalContext = createContext<GlobalContext>(initialGlobalContext);

export default function ContextWrapper({ children }: any) {
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  const globalContext = {
    searchLoading,
    setSearchLoading,
    initialLoading,
    setInitialLoading,
  };

  return (
    <GlobalContext.Provider value={globalContext}>
      {children}
    </GlobalContext.Provider>
  );
}
