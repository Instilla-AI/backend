'use client';

import { QueryProvider } from '@/lib/providers/query-provider';
import { useEffect, useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }
  
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  );
}
