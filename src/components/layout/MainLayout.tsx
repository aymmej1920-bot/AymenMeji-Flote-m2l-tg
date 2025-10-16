import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import Sidebar from './Sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, Variants, Easing } from 'framer-motion'; // Import motion, Variants, and Easing

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const containerVariants: Variants = { // Explicitly type as Variants
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: [0.42, 0, 0.58, 1] as Easing } }, // Explicitly cast to Easing
  };

  const headerVariants: Variants = { // Explicitly type as Variants
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.2, ease: [0.42, 0, 0.58, 1] as Easing } }, // Explicitly cast to Easing
  };

  const mainContentVariants: Variants = { // Explicitly type as Variants
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.4, ease: [0.42, 0, 0.58, 1] as Easing } }, // Explicitly cast to Easing
  };

  const footerVariants: Variants = { // Explicitly type as Variants
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.6, ease: [0.42, 0, 0.58, 1] as Easing } }, // Explicitly cast to Easing
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
          className="bg-card text-foreground p-4 shadow-md border-b border-border flex justify-between items-center"
          variants={headerVariants}
        >
          <Link to="/" className="text-2xl font-heading font-bold text-primary">
            M2l-TG
          </Link>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground hidden md:block">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>FM</AvatarFallback>
            </Avatar>
            <ThemeToggle />
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