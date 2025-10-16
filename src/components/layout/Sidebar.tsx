"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CustomButton } from '@/components/CustomButton';
import { LayoutDashboard, Car, Users, Route, Fuel, FileText, Wrench, BarChart3, Truck, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, Variants, Easing } from 'framer-motion';
import { toast } from 'sonner';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Véhicules', href: '/vehicles', icon: Car },
  { name: 'Conducteurs', href: '/drivers', icon: Users },
  { name: 'Tournées', href: '/tours', icon: Route },
  { name: 'Carburant', href: '/fuel', icon: Fuel },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Maintenance', href: '/maintenance', icon: Wrench },
  { name: 'Résumé', href: '/summary', icon: BarChart3 },
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
      className="w-64 bg-sidebar-bg-dark text-white professional-shadow flex flex-col frosted-glass-effect" // Apply new background and glass effect
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
    >
      <div className="p-6 border-b border-gray-700">
          <Link to="/" className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-full">
                  <Truck className="text-2xl" />
              </div>
              <div>
                  <h2 className="text-2xl font-bold text-white">Fleet Manager Pro</h2>
                  <p className="text-gray-400 text-sm">Gestion de Flotte</p>
              </div>
          </Link>
      </div>
      <nav className="flex-grow px-4 py-6 space-y-2">
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
                  "sidebar-btn", // Custom class for sidebar button styling
                  isActive
                    ? "bg-accent text-white shadow-md" // Active state styling using accent color
                    : "hover:bg-gray-700 text-gray-300 hover:text-white" // Inactive state styling
                )}
                asChild
              >
                <Link to={item.href} className="flex items-center gap-3">
                  <item.icon className={cn("h-5 w-5", isActive && "ml-0")} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </CustomButton>
            </motion.div>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <CustomButton 
          onClick={() => { /* Implement data reset logic here */ toast.info("Fonctionnalité de réinitialisation des données à implémenter."); }} 
          className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
        >
          <LogOut className="h-4 w-4 mr-2" /> Réinitialiser Données
        </CustomButton>
      </div>
    </motion.aside>
  );
};

export default Sidebar;