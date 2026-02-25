import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AnimatePresence } from "framer-motion";
import ProtectedRoute from "@/components/ProtectedRoute";
import PageTransition from "@/components/PageTransition";
import Index from "./pages/Index";
import RoutesPage from "./pages/Routes";
import RouteDetail from "./pages/RouteDetail";
import Communities from "./pages/Communities";
import CommunityDetail from "./pages/CommunityDetail";
import ChannelDetail from "./pages/ChannelDetail";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Profile from "./pages/Profile";
import Achievements from "./pages/Achievements";
import Auth from "./pages/Auth";
import Legends from "./pages/Legends";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
        <Route path="/" element={<ProtectedRoute><PageTransition><Index /></PageTransition></ProtectedRoute>} />
        <Route path="/routes" element={<ProtectedRoute><PageTransition><RoutesPage /></PageTransition></ProtectedRoute>} />
        <Route path="/routes/:id" element={<ProtectedRoute><PageTransition><RouteDetail /></PageTransition></ProtectedRoute>} />
        <Route path="/communities" element={<ProtectedRoute><PageTransition><Communities /></PageTransition></ProtectedRoute>} />
        <Route path="/communities/:id" element={<ProtectedRoute><PageTransition><CommunityDetail /></PageTransition></ProtectedRoute>} />
        <Route path="/communities/:communityId/channels/:channelId" element={<ProtectedRoute><PageTransition><ChannelDetail /></PageTransition></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><PageTransition><Events /></PageTransition></ProtectedRoute>} />
        <Route path="/events/:id" element={<ProtectedRoute><PageTransition><EventDetail /></PageTransition></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>} />
        <Route path="/achievements" element={<ProtectedRoute><PageTransition><Achievements /></PageTransition></ProtectedRoute>} />
        <Route path="/legends" element={<PageTransition><Legends /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="sendero-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
