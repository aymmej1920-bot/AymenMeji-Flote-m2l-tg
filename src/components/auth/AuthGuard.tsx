"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);

      if (!session && location.pathname !== '/login') {
        toast.info("Veuillez vous connecter pour accéder à l'application.");
        navigate('/login');
      } else if (session && location.pathname === '/login') {
        navigate('/dashboard'); // Redirect authenticated users from login page
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (event === 'SIGNED_OUT') {
        toast.info("Vous avez été déconnecté.");
        navigate('/login');
      } else if (event === 'SIGNED_IN' && location.pathname === '/login') {
        toast.success("Connexion réussie !");
        navigate('/dashboard');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  // If not authenticated and not on login page, redirect to login
  if (!session && location.pathname !== '/login') {
    return null; // Render nothing while redirecting
  }

  // If authenticated and on login page, redirect to dashboard
  if (session && location.pathname === '/login') {
    return null; // Render nothing while redirecting
  }

  return <>{children}</>;
};

export default AuthGuard;