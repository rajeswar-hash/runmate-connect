import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";
import HomeScreen from "./pages/HomeScreen";
import RunningScreen from "./pages/RunningScreen";
import NearbyScreen from "./pages/NearbyScreen";
import ActivityScreen from "./pages/ActivityScreen";
import ProfileScreen from "./pages/ProfileScreen";
import SettingsScreen from "./pages/SettingsScreen";
import ChatScreen from "./pages/ChatScreen";
import LoginScreen from "./pages/LoginScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-[100dvh] flex items-center justify-center bg-background text-foreground">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppRoutes = () => (
  <div className="max-w-lg mx-auto relative">
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
      <Route path="/running" element={<ProtectedRoute><RunningScreen /></ProtectedRoute>} />
      <Route path="/nearby" element={<ProtectedRoute><NearbyScreen /></ProtectedRoute>} />
      <Route path="/activity" element={<ProtectedRoute><ActivityScreen /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsScreen /></ProtectedRoute>} />
      <Route path="/chat/:id" element={<ProtectedRoute><ChatScreen /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <BottomNav />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
