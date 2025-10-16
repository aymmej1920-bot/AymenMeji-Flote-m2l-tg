"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CustomButton } from '@/components/CustomButton';
import { Home, LayoutDashboard } from 'lucide-react'; // Only keep essential icons
import { cn } from '@/lib/utils';
import { motion, Variants, Easing } from 'framer-motion';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { name: 'Accueil', href: '/', icon: Home },
  { name: 'Tableau de Bord', href: '/dashboard', icon: LayoutDashboard }, // Placeholder for future dashboard
];

const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();

  const sidebarVariants: Variants = {
    hidden: { x: -200, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5, ease: [0.42, 0, 0.58, 1] as Easing } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.1 + i * 0.05, ease: [0.42, 0, 0.58, 1] as Easing },
    }),
  };

  return (
    <motion.aside
      className="w-64 bg-sidebar-background text-sidebar-foreground border-r border-sidebar-border p-4 flex flex-col shadow-lg"
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
    >
      <nav className="flex-grow space-y-2">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.href;
          return (
            <motion.div
              key={item.name}
              variants={itemVariants}
              custom={index}
              className="relative"
            >
              <CustomButton
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left px-4 py-2 rounded-lg transition-colors duration-200",
                  isActive
                    ? "bg-sidebar-primary/10 text-sidebar-primary hover:bg-sidebar-primary/20"
                    : "hover:bg-sidebar-border hover:text-sidebar-foreground"
                )}
                asChild
              >
                <Link to={item.href} className="flex items-center gap-3">
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 top-0 h-full w-1 bg-sidebar-primary rounded-r-md"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <item.icon className={cn("h-5 w-5", isActive && "ml-2")} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </CustomButton>
            </motion.div>
          );
        })}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;