import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Vehicles from "./pages/Vehicles";
import Dashboard from "./pages/Dashboard";
import Drivers from "./pages/Drivers";
import Maintenance from "./pages/Maintenance";
import Fuel from "./pages/Fuel";
import Documents from "./pages/Documents";
import Tours from "./pages/Tours";
import Inspections from "./pages/Inspections";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login"; // Import Login page
import MainLayout from "./components/layout/MainLayout";
import AuthGuard from "./components/auth/AuthGuard"; // Import AuthGuard

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/login" element={<Login />} /> {/* Login route */}
          <Route
            path="/*" // Catch-all for protected routes
            element={
              <AuthGuard>
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/vehicles" element={<Vehicles />} />
                    <Route path="/drivers" element={<Drivers />} />
                    <Route path="/maintenance" element={<Maintenance />} />
                    <Route path="/fuel" element={<Fuel />} />
                    <Route path="/documents" element={<Documents />} />
                    <Route path="/tours" element={<Tours />} />
                    <Route path="/inspections" element={<Inspections />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/notifications" element={<Notifications />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </MainLayout>
              </AuthGuard>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;