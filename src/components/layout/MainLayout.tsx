import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import Sidebar from './Sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, Variants, Easing } from 'framer-motion';
import { supabase, auth } from '@/lib/supabase';
import { toast } from 'sonner';
import { CustomButton } from '@/components/CustomButton';
import { LogOut, Download, Upload, Truck } from 'lucide-react';

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

  const handleExportData = () => {
    toast.info("Fonctionnalité d'exportation à implémenter.");
    // Logic for exporting data (e.g., fetch from Supabase, convert to JSON/XLSX)
  };

  const handleImportData = () => {
    toast.info("Fonctionnalité d'importation à implémenter.");
    // Logic for importing data (e.g., read file, parse, insert/update in Supabase)
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
          className="text-white professional-shadow p-6 flex justify-between items-center frosted-glass-effect" // Apply frosted glass effect
          variants={headerVariants}
        >
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-full">
                <Truck className="text-2xl" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-main-text">Fleet Manager Pro</h2> {/* Use main-text color */}
                <p className="text-secondary-text text-sm">Gestion de Flotte</p> {/* Use secondary-text color */}
            </div>
          </Link>
          <div className="flex items-center space-x-4">
            <CustomButton 
              onClick={handleExportData} 
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-300 text-main-text hidden md:flex items-center gap-2" // Use main-text color
              variant="ghost"
            >
              <Download className="h-4 w-4" /> Exporter (JSON)
            </CustomButton>
            <CustomButton 
              onClick={handleImportData} 
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-300 text-main-text hidden md:flex items-center gap-2" // Use main-text color
              variant="ghost"
            >
              <Upload className="h-4 w-4" /> Importer (JSON)
            </CustomButton>
            {userEmail && (
              <div className="flex items-center space-x-2 bg-white bg-opacity-10 rounded-full px-3 py-1">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback className="text-xs text-main-text">FM</AvatarFallback> {/* Use main-text color */}
                </Avatar>
                <span className="text-sm font-medium text-main-text hidden sm:block">{userEmail}</span> {/* Use main-text color */}
              </div>
            )}
            <ThemeToggle />
            <CustomButton variant="ghost" size="icon" onClick={handleLogout} className="text-main-text hover:bg-white hover:bg-opacity-20"> {/* Use main-text color */}
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Déconnexion</span>
            </CustomButton>
          </div>
        </motion.header>
        <motion.main
          className="flex-grow p-6 overflow-auto"
          variants={mainContentVariants}
        >
          {children}
        </motion.main>
        <motion.footer
          className="p-4 text-center text-sm text-secondary-text border-t border-border bg-card" // Use secondary-text color
          variants={footerVariants}
        >
          © {new Date().getFullYear()} M2l-TG. Made with Dyad.
        </motion.footer>
      </div>
    </motion.div>
  );
};

export default MainLayout;