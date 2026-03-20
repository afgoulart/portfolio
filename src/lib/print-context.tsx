'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface PrintContextType {
  isPrintMode: boolean;
  togglePrintMode: () => void;
  openPrintDialog: () => void;
}

const PrintContext = createContext<PrintContextType | undefined>(undefined);

export function PrintProvider({ children }: { children: React.ReactNode }) {
  const [isPrintMode, setIsPrintMode] = useState(false);

  const togglePrintMode = useCallback(() => {
    setIsPrintMode((prev) => !prev);
  }, []);

  const openPrintDialog = useCallback(() => {
    window.print();
  }, []);

  return (
    <PrintContext.Provider value={{ isPrintMode, togglePrintMode, openPrintDialog }}>
      {children}
    </PrintContext.Provider>
  );
}

export function usePrint() {
  const context = useContext(PrintContext);
  if (context === undefined) {
    throw new Error('usePrint must be used within a PrintProvider');
  }
  return context;
}
