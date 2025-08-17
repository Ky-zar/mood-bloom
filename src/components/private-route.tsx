"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './auth-provider';
import { Loader2 } from 'lucide-react';
import { ReactNode, useEffect } from 'react';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.push('/login');
      return;
    }

    // If the user has no display name and they are not on the welcome page, redirect them.
    if (!user.displayName && pathname !== '/welcome') {
      router.push('/welcome');
    }

  }, [user, loading, router, pathname]);


  if (loading) {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  // If user is not loaded or does not exist, we return null because the useEffect will handle redirection.
  if (!user) {
    return null;
  }
  
  // If user exists but has no displayName, and is not on welcome page, we also return null;
  if (!user.displayName && pathname !== '/welcome') {
      return null;
  }

  // If user is trying to access welcome page but already has a displayName, redirect to dashboard
  if (user.displayName && pathname === '/welcome') {
      router.push('/log-mood');
      return null;
  }


  return <>{children}</>;
};

export default PrivateRoute;
