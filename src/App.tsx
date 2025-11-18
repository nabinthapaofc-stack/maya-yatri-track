import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import PassengerDashboard from "./pages/passenger/Dashboard";
import PassengerHistory from "./pages/passenger/History";
import PassengerSearch from "./pages/passenger/Search";
import PassengerMessages from "./pages/passenger/Messages";
import DriverDashboard from "./pages/driver/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import NotFound from "./pages/NotFound";
import SplashAnimation from "./components/SplashAnimation.jsx";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500); // 2.5 seconds as requested

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashAnimation />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Passenger Routes */}
            <Route path="/passenger/dashboard" element={<PassengerDashboard />} />
            <Route path="/passenger/history" element={<PassengerHistory />} />
            <Route path="/passenger/search" element={<PassengerSearch />} />
            <Route path="/passenger/messages" element={<PassengerMessages />} />
            
            {/* Driver Routes */}
            <Route path="/driver/dashboard" element={<DriverDashboard />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            {/* Catch-all 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
