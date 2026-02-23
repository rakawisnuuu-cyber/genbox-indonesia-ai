import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "@/components/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import Characters from "./pages/Characters";
import CreateCharacter from "./pages/CreateCharacter";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Placeholder pages for routes not yet built
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center space-y-3">
      <h1 className="text-2xl font-bold font-satoshi text-white">{title}</h1>
      <p className="text-[#666] text-sm">Halaman ini sedang dalam pengembangan.</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Dashboard layout wraps all authenticated routes */}
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/generate" element={<PlaceholderPage title="Buat Gambar" />} />
              <Route path="/characters" element={<Characters />} />
              <Route path="/characters/create" element={<CreateCharacter />} />
              <Route path="/gallery" element={<PlaceholderPage title="Gallery" />} />
              <Route path="/prompt" element={<PlaceholderPage title="Prompt Generator" />} />
              <Route path="/blueprint" element={<PlaceholderPage title="n8n Blueprint" />} />
              <Route path="/video" element={<PlaceholderPage title="Buat Video" />} />
              <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
