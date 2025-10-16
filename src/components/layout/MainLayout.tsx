import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import Sidebar from './Sidebar'; // Import the new Sidebar component

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-background font-sans"> {/* Changed to flex for sidebar layout */}
      <Sidebar /> {/* Integrate the Sidebar */}
      <div className="flex flex-col flex-grow"> {/* Main content area */}
        <header className="bg-card text-foreground p-4 shadow-md border-b border-border flex justify-between items-center"> {/* Simplified header */}
          <Link to="/" className="text-2xl font-heading font-bold text-primary">
            Fleet Manager
          </Link>
          <ThemeToggle /> {/* Keep ThemeToggle in the header */}
        </header>
        <main className="flex-grow p-4 overflow-auto"> {/* Added overflow-auto for scrollable content */}
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