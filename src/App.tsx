import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "@/components/BottomNav";
import HomeScreen from "./pages/HomeScreen";
import RunningScreen from "./pages/RunningScreen";
import NearbyScreen from "./pages/NearbyScreen";
import ActivityScreen from "./pages/ActivityScreen";
import ProfileScreen from "./pages/ProfileScreen";
import ChatScreen from "./pages/ChatScreen";
import LoginScreen from "./pages/LoginScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="max-w-lg mx-auto relative">
          <Routes>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/" element={<HomeScreen />} />
            <Route path="/running" element={<RunningScreen />} />
            <Route path="/nearby" element={<NearbyScreen />} />
            <Route path="/activity" element={<ActivityScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/chat/:id" element={<ChatScreen />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
