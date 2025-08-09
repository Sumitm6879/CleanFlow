import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DatabaseStatus } from "@/components/DatabaseStatus";
import "./lib/map-error-handler"; // Initialize global error handler
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Maps from "./pages/Maps";
import Report from "./pages/Report";
import NGOInfo from "./pages/NGOInfo";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Partner from "./pages/Partner";
import Privacy from "./pages/Privacy";
import { CleanupDriveOrganization } from "./pages/CleanupDriveOrganization";
import CleanupDrives from "./pages/CleanupDrives";
import OrganizeDrive from "./pages/OrganizeDrive";
import DrivePhotos from "./pages/DrivePhotos";
import { UserProfile } from "./pages/UserProfile";
import { Leaderboard } from "./pages/Leaderboard";
import { ParticipationTracking } from "./pages/ParticipationTracking";
import { DetailedDrive } from "./pages/DetailedDrive";
import ResetPassword from "./pages/ResetPassword";
import { EditProfile } from "./pages/EditProfile";
import { Debug } from "./pages/Debug";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes - no authentication required */}
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/maps" element={<Maps />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/partner" element={<Partner />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/debug" element={<Debug />} />

            {/* Protected routes - authentication required */}
            <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
            <Route path="/ngo/:id" element={<ProtectedRoute><NGOInfo /></ProtectedRoute>} />
            <Route path="/ngo-partners" element={<ProtectedRoute><NGOInfo /></ProtectedRoute>} />
            <Route path="/organize" element={<ProtectedRoute><CleanupDrives /></ProtectedRoute>} />
            <Route path="/organize-drive" element={<ProtectedRoute><OrganizeDrive /></ProtectedRoute>} />
            <Route path="/drive-photos" element={<ProtectedRoute><DrivePhotos /></ProtectedRoute>} />
            <Route path="/cleanupDriveOrganization" element={<ProtectedRoute><CleanupDriveOrganization /></ProtectedRoute>} />
            <Route path="/CleanupDriveOrganization" element={<ProtectedRoute><CleanupDriveOrganization /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/userProfile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/UserProfile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/Leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/participation" element={<ProtectedRoute><ParticipationTracking /></ProtectedRoute>} />
            <Route path="/participationTracking" element={<ProtectedRoute><ParticipationTracking /></ProtectedRoute>} />
            <Route path="/ParticipationTracking" element={<ProtectedRoute><ParticipationTracking /></ProtectedRoute>} />
            <Route path="/drive/:id" element={<ProtectedRoute><DetailedDrive /></ProtectedRoute>} />
            <Route path="/detailedDrive/:id" element={<ProtectedRoute><DetailedDrive /></ProtectedRoute>} />
            <Route path="/DetailedDrive/:id" element={<ProtectedRoute><DetailedDrive /></ProtectedRoute>} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <DatabaseStatus />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

// Ensure createRoot is only called once
const container = document.getElementById("root")!;
let root = (globalThis as any).__react_root__;

if (!root) {
  root = createRoot(container);
  (globalThis as any).__react_root__ = root;
}

root.render(<App />);
