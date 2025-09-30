'use client';

import { AutumnProvider } from 'autumn-js/react';
import { QueryProvider } from '@/lib/providers/query-provider';
import { AutumnCustomerProvider } from '@/hooks/useAutumnCustomer';
import { useSession } from '@/lib/auth-client';
import { useEffect, useState } from 'react';

function AuthAwareAutumnProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted || isPending) {
    return <>{children}</>;
  }
  
  // Temporarily disable Autumn billing until API key is configured
  // Only render AutumnProvider when logged in AND Autumn is configured
  const autumnConfigured = process.env.NEXT_PUBLIC_AUTUMN_ENABLED === 'true';
  
  if (!session || !autumnConfigured) {
    return <>{children}</>;
  }
  
  return (
    <AutumnProvider
      backendUrl="/api/auth/autumn"
      betterAuthUrl={process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}
    >
      <AutumnCustomerProvider>
        {children}
      </AutumnCustomerProvider>
    </AutumnProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthAwareAutumnProvider>
        {children}
      </AuthAwareAutumnProvider>
    </QueryProvider>
  );
}