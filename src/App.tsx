import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Vehicles from "./pages/Vehicles";
import Dashboard from "./pages/Dashboard";
import Drivers from "./pages/Drivers"; // Import new pages
import Maintenance from "./pages/Maintenance";
import Fuel from "./pages/Fuel";
import Documents from "./pages/Documents";
import Tours from "./pages/Tours";
import Inspections from "./pages/Inspections";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import MainLayout from "./components/layout/MainLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/drivers" element={<Drivers />} /> {/* New route */}
            <Route path="/maintenance" element={<Maintenance />} /> {/* New route */}
            <Route path="/fuel" element={<Fuel />} /> {/* New route */}
            <Route path="/documents" element={<Documents />} /> {/* New route */}
            <Route path="/tours" element={<Tours />} /> {/* New route */}
            <Route path="/inspections" element={<Inspections />} /> {/* New route */}
            <Route path="/reports" element={<Reports />} /> {/* New route */}
            <Route path="/notifications" element={<Notifications />} /> {/* New route */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;