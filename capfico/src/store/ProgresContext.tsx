import React, { createContext, useContext } from 'react';
import { useProgres } from './progress';

type ProgresContextType = ReturnType<typeof useProgres>;

const ProgresContext = createContext<ProgresContextType | null>(null);

export function ProgresProvider({ children }: { children: React.ReactNode }) {
  const value = useProgres();
  return <ProgresContext.Provider value={value}>{children}</ProgresContext.Provider>;
}

export function useProgresContext(): ProgresContextType {
  const ctx = useContext(ProgresContext);
  if (!ctx) throw new Error('useProgresContext fora del ProgresProvider');
  return ctx;
}
