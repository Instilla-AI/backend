'use client';

import { createContext, useContext, ReactNode } from 'react';

interface AutumnCustomerContextType {
  customerId?: string;
  isLoading: boolean;
}

const AutumnCustomerContext = createContext<AutumnCustomerContextType | undefined>(undefined);

export function AutumnCustomerProvider({ children }: { children: ReactNode }) {
  const value = {
    customerId: undefined,
    isLoading: false,
  };

  return (
    <AutumnCustomerContext.Provider value={value}>
      {children}
    </AutumnCustomerContext.Provider>
  );
}

export function useAutumnCustomer() {
  const context = useContext(AutumnCustomerContext);
  if (context === undefined) {
    throw new Error('useAutumnCustomer must be used within AutumnCustomerProvider');
  }
  return context;
}
