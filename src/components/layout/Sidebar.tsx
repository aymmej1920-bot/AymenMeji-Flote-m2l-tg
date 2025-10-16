"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CustomButton } from '@/components/CustomButton';
import { Car, Users, Fuel, FileText, Wrench, Map, BarChart2, Bell, Home, LayoutDashboard } from 'lucide-react'; // Removed ClipboardList
import { cn } from '@/lib/utils';
import { motion, Variants, Easing } from 'framer-motion'; // Import motion, Variants, and Easing

interface SidebarProps {
  isOpen?: boolean; // Potentiellement pour un état mobile
  onClose?: () => void; // Potentiellement pour un un état mobile
}

const navItems = [
  { name: 'Accueil', href: '/', icon: Home },
  { name: 'Tableau de Bord', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Véhicules', href: '/vehicles', icon: Car },
  { name: 'Conducteurs', href: '/drivers', icon: Users },
  { name: 'Maintenance', href: '/maintenance', icon: Wrench },
  { name: 'Carburant', href: '/fuel', icon: Fuel },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Tournées', href: '/tours', icon: Map },
  // { name: 'Inspections', href: '/inspections', icon: ClipboardList }, // Removed inspection item
  { name: 'Rapports', href: '/reports', icon: BarChart2 },
  { name: 'Alertes', href: '/notifications', icon: Bell },
];

const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();

  const sidebarVariants: Variants = {
    hidden: { x: -200, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5, ease: [0.42, 0, 0.58, 1] as Easing } }, // Explicitly cast to Easing
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({ // This is correct for Variants
      opacity: 1,
      x: 0,
      transition: { delay: 0.1 + i * 0.05, ease: [0.42, 0, 0.58, 1] as Easing }, // Explicitly cast to Easing
    }),
  };

  return (
    <motion.aside
      className="w-64 bg-card text-foreground border-r border-border p-4 flex flex-col shadow-lg"
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
              custom={index} // Pass index as custom prop for staggered animation
            >
              <CustomButton
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left px-4 py-2 rounded-lg transition-colors duration-200",
                  isActive
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "hover:bg-muted hover:text-foreground"
                )}
                asChild
              >
                <Link to={item.href} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
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