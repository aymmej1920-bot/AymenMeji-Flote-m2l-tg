"use client";

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CustomButton } from '@/components/CustomButton';
import { Car, Users, Fuel, FileText, Wrench, Map, ClipboardList, BarChart2, Bell, Home, LayoutDashboard } from 'lucide-react'; // Import LayoutDashboard icon
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen?: boolean; // Potentiellement pour un état mobile
  onClose?: () => void; // Potentiellement pour un état mobile
}

const navItems = [
  { name: 'Accueil', href: '/', icon: Home },
  { name: 'Tableau de Bord', href: '/dashboard', icon: LayoutDashboard }, // Nouveau lien pour le tableau de bord
  { name: 'Véhicules', href: '/vehicles', icon: Car },
  { name: 'Conducteurs', href: '/drivers', icon: Users },
  { name: 'Maintenance', href: '/maintenance', icon: Wrench },
  { name: 'Carburant', href: '/fuel', icon: Fuel },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Tournées', href: '/tours', icon: Map },
  { name: 'Inspections', href: '/inspections', icon: ClipboardList },
  { name: 'Rapports', href: '/reports', icon: BarChart2 },
  { name: 'Alertes', href: '/notifications', icon: Bell },
];

const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-card text-foreground border-r border-border p-4 flex flex-col shadow-lg">
      <nav className="flex-grow space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <CustomButton
              key={item.name}
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
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;