import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Car, Users, Fuel, FileText, Wrench, Map, ClipboardList, BarChart2, Bell } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            Fleet Manager
          </Link>
          <nav className="space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/vehicles" className="flex items-center gap-2">
                <Car className="h-4 w-4" /> Véhicules
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/drivers" className="flex items-center gap-2">
                <Users className="h-4 w-4" /> Conducteurs
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/maintenance" className="flex items-center gap-2">
                <Wrench className="h-4 w-4" /> Maintenance
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/fuel" className="flex items-center gap-2">
                <Fuel className="h-4 w-4" /> Carburant
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> Documents
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/tours" className="flex items-center gap-2">
                <Map className="h-4 w-4" /> Tournées
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/inspections" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" /> Inspections
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/reports" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" /> Rapports
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" /> Alertes
              </Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
      <footer className="p-4 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} Fleet Manager. Made with Dyad.
      </footer>
    </div>
  );
};

export default MainLayout;