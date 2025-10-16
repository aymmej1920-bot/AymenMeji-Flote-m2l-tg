import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import Sidebar from './Sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, Variants, Easing } from 'framer-motion';
import { supabase, auth } from '@/lib/supabase';
import { toast } from 'sonner';
import { CustomButton } from '@/components/CustomButton';
import { LogOut } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await auth.getUser();
      if (user) {
        setUserEmail(user.email ?? null);
      } else {
        setUserEmail(null);
      }
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserEmail(session.user.email ?? null);
      } else {
        setUserEmail(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await auth.signOut();
    if (error) {
      console.error("Erreur lors de la déconnexion:", error.message);
      toast.error("Erreur lors de la déconnexion: " + error.message);
    } else {
      toast.success("Déconnexion réussie !");
      navigate('/login');
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: [0.42, 0, 0.58, 1] as Easing } },
  };

  const headerVariants: Variants = {
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.2, ease: [0.42, 0, 0.58, 1] as Easing } },
  };

  const mainContentVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.4, ease: [0.42, 0, 0.58, 1] as Easing } },
  };

  const footerVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.6, ease: [0.42, 0, 0.58, 1] as Easing } },
  };

  return (
    <motion.div
      className="min-h-screen flex bg-background font-sans"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <motion.header
          className="bg-card text-foreground p-4 shadow-sm border-b border-border flex justify-between items-center" // Adjusted shadow
          variants={headerVariants}
        >
          <Link to="/" className="text-2xl font-heading font-bold text-primary">
            Fleet Manager M2l-TG
          </Link>
          <div className="flex items-center space-x-4">
            <div className="text-xs text-muted-foreground hidden md:block"> {/* Smaller text for date */}
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            {userEmail && (
              <div className="flex items-center space-x-2 bg-muted rounded-full px-3 py-1"> {/* Pill shape for user */}
                <Avatar className="h-6 w-6"> {/* Smaller avatar */}
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback className="text-xs">FM</AvatarFallback> {/* Smaller fallback text */}
                </Avatar>
                <span className="text-sm font-medium text-foreground hidden sm:block">{userEmail}</span>
              </div>
            )}
            <ThemeToggle />
            <CustomButton variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> {/* Smaller icon */}
              <span className="sr-only">Déconnexion</span>
            </CustomButton>
          </div>
        </motion.header>
        <motion.main
          className="flex-grow p-4 overflow-auto"
          variants={mainContentVariants}
        >
          {children}
        </motion.main>
        <motion.footer
          className="p-4 text-center text-sm text-muted-foreground border-t border-border bg-card"
          variants={footerVariants}
        >
          © {new Date().getFullYear()} M2l-TG. Made with Dyad.
        </motion.footer>
      </div>
    </motion.div>
  );
};

export default MainLayout;