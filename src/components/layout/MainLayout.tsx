import React from 'react';
import { Link } from 'react-router-dom';
import { CustomButton } from '@/components/CustomButton';
import { ThemeToggle } from '@/components/ThemeToggle'; // Import ThemeToggle
import { Car, Users, Fuel, FileText, Wrench, Map, ClipboardList, BarChart2, Bell } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans"> {/* Use bg-background for theme support */}
      <header className="bg-card text-foreground p-4 shadow-md border-b border-border"> {/* Use theme colors */}
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-heading font-bold text-primary"> {/* Use text-primary for logo */}
            Fleet Manager
          </Link>
          <nav className="flex items-center space-x-4"> {/* Added flex items-center */}
            <CustomButton variant="ghost" asChild>
              <Link to="/vehicles" className="flex items-center gap-2 text-foreground hover:text-primary">
                <Car className="h-4 w-4" /> Véhicules
              </Link>
            </CustomButton>
            <CustomButton variant="ghost" asChild>
              <Link to="/drivers" className="flex items-center gap-2 text-foreground hover:text-primary">
                <Users className="h-4 w-4" /> Conducteurs
              </Link>
            </CustomButton>
            <CustomButton variant="ghost" asChild>
              <Link to="/maintenance" className="flex items-center gap-2 text-foreground hover:text-primary">
                <Wrench className="h-4 w-4" /> Maintenance
              </Link>
            </CustomButton>
            <CustomButton variant="ghost" asChild>
              <Link to="/fuel" className="flex items-center gap-2 text-foreground hover:text-primary">
                <Fuel className="h-4 w-4" /> Carburant
              </Link>
            </CustomButton>
            <CustomButton variant="ghost" asChild>
              <Link to="/documents" className="flex items-center gap-2 text-foreground hover:text-primary">
                <FileText className="h-4 w-4" /> Documents
              </Link>
            </CustomButton>
            <CustomButton variant="ghost" asChild>
              <Link to="/tours" className="flex items-center gap-2 text-foreground hover:text-primary">
                <Map className="h-4 w-4" /> Tournées
              </Link>
            </CustomButton>
            <CustomButton variant="ghost" asChild>
              <Link to="/inspections" className="flex items-center gap-2 text-foreground hover:text-primary">
                <ClipboardList className="h-4 w-4" /> Inspections
              </Link>
            </CustomButton>
            <CustomButton variant="ghost" asChild>
              <Link to="/reports" className="flex items-center gap-2 text-foreground hover:text-primary">
                <BarChart2 className="h-4 w-4" /> Rapports
              </Link>
            </CustomButton>
            <CustomButton variant="ghost" asChild>
              <Link to="/notifications" className="flex items-center gap-2 text-foreground hover:text-primary">
                <Bell className="h-4 w-4" /> Alertes
              </Link>
            </CustomButton>
            <ThemeToggle /> {/* Add ThemeToggle here */}
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
      <footer className="p-4 text-center text-sm text-muted-foreground border-t border-border bg-card"> {/* Use theme colors */}
        © {new Date().getFullYear()} Fleet Manager. Made with Dyad.
      </footer>
    </div>
  );
};

export default MainLayout;