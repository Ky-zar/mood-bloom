"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from './auth-provider';
import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return <>{children}</>;
};

export default PrivateRoute;
