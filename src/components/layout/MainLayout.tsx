import React from 'react';
import { Link } from 'react-router-dom';
import { CustomButton } from '@/components/CustomButton'; // Utiliser CustomButton
import { Car, Users, Fuel, FileText, Wrench, Map, ClipboardList, BarChart2, Bell } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-light-grey font-sans"> {/* Utiliser light-grey pour le fond */}
      <header className="bg-night-blue text-white p-4 shadow-md"> {/* Utiliser night-blue pour l'en-tête */}
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-heading font-bold"> {/* Utiliser font-heading */}
            Fleet Manager
          </Link>
          <nav className="space-x-4">
            <CustomButton variant="ghost" asChild>
              <Link to="/vehicles" className="flex items-center gap-2 text-white hover:text-turquoise"> {/* Ajuster les couleurs de texte */}
                <Car className="h-4 w-4" /> Véhicules
              </Link>
            </CustomButton>
            <CustomButton variant="ghost" asChild>
              <Link to="/drivers" className="flex items-center gap-2 text-white hover:text-turquoise">
                <Users className="h-4 w-4" /> Conducteurs
              </Link>
            </CustomButton>
            <CustomButton variant="ghost" asChild>
              <Link to="/maintenance" className="flex items-center gap-2 text-white hover:text-turquoise">
                <Wrench className="h-4 w-4" /> Maintenance
              </Link>
            </CustomButton>
            <CustomButton variant="ghost" asChild>
              <Link to="/fuel" className="flex items-center gap-2 text-white hover:text-turquoise">
                <Fuel className="h-4 w-4" /> Carburant
              </Link>
            </CustomButton>
            <CustomButton variant="ghost" asChild>
              <Link to="/documents" className="flex items-center gap-2 text-white hover:text-turquoise">
                <FileText className="h-4 w-4" /> Documents
              </Link>
            </CustomButton>
            <CustomButton variant="ghost" asChild>
              <Link to="/tours" className="flex items-center gap-2 text-white hover:text-turquoise">
                <Map className="h-4 w-4" /> Tournées
              </Link>
            </CustomButton>
            <CustomButton variant="ghost" asChild>
              <Link to="/inspections" className="flex items-center gap-2 text-white hover:text-turquoise">
                <ClipboardList className="h-4 w-4" /> Inspections
              </Link>
            </CustomButton>
            <CustomButton variant="ghost" asChild>
              <Link to="/reports" className="flex items-center gap-2 text-white hover:text-turquoise">
                <BarChart2 className="h-4 w-4" /> Rapports
              </Link>
            </CustomButton>
            <CustomButton variant="ghost" asChild>
              <Link to="/notifications" className="flex items-center gap-2 text-white hover:text-turquoise">
                <Bell className="h-4 w-4" /> Alertes
              </Link>
            </CustomButton>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
      <footer className="p-4 text-center text-sm text-dark-grey border-t border-light-grey bg-white"> {/* Ajuster les couleurs du footer */}
        © {new Date().getFullYear()} Fleet Manager. Made with Dyad.
      </footer>
    </div>
  );
};

export default MainLayout;