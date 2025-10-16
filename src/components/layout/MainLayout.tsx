import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import Sidebar from './Sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Import Avatar components

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-background font-sans">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <header className="bg-card text-foreground p-4 shadow-md border-b border-border flex justify-between items-center">
          <Link to="/" className="text-2xl font-heading font-bold text-primary">
            Fleet Manager
          </Link>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground hidden md:block">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> {/* Placeholder image */}
              <AvatarFallback>FM</AvatarFallback> {/* Fallback for Fleet Manager */}
            </Avatar>
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-grow p-4 overflow-auto">
          {children}
        </main>
        <footer className="p-4 text-center text-sm text-muted-foreground border-t border-border bg-card">
          © {new Date().getFullYear()} Fleet Manager. Made with Dyad.
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;