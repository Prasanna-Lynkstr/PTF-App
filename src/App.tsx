import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import AdminHome from "./pages/admin_/adminhome";
import CandidateIntentAssessment from "./pages/talents/home";
import HiringOrgIndex from "./pages/hiring-org/index";
import HiringOrgSignup from "./pages/hiring-org/signup";
import RecruiterDashboard from "./pages/hiring-org/home";
import OrgAdminDashboard from "./pages/hiring-org/admin";
import AdminTeams from "./pages/hiring-org/admin/team";
import AdminUsers from "./pages/hiring-org/admin/user";
import AdminBilling from "./pages/hiring-org/admin/billing";
import AdminConfig from "./pages/hiring-org/admin/config";
import AssessmentInvite from "./pages//hiring-org/assessment-invite";
import Assessment from "./pages/hiring-org/assessment";
import Invite from "./pages/hiring-org/invite";
import Response from "./pages/hiring-org/response";
import EmailVerify from "./pages/hiring-org/emailverify";
import ForgotPassword from "./pages/hiring-org/forgot-password";
import Settings from "./pages/hiring-org/settings";
import Profile from "./pages/hiring-org/admin/profile";
import NoAccess from "./pages/no-access";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin_" element={<AdminHome />} />
          <Route path="/talent" element={<CandidateIntentAssessment />} />
          <Route path="/hiring-org" element={<HiringOrgIndex />} />
          <Route path="/hiring-org/signup" element={<HiringOrgSignup />} />
          <Route path="/hiring-org/home" element={<ProtectedRoute><RecruiterDashboard /></ProtectedRoute>} />
          <Route path="/hiring-org/admin" element={<ProtectedRoute><OrgAdminDashboard /></ProtectedRoute>} />
          <Route path="/hiring-org/admin/team" element={<ProtectedRoute><AdminTeams /></ProtectedRoute>} />
          <Route path="/hiring-org/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
          <Route path="/hiring-org/admin/billing" element={<ProtectedRoute><AdminBilling /></ProtectedRoute>} />
          <Route path="/hiring-org/admin/config" element={<ProtectedRoute><AdminConfig /></ProtectedRoute>} />
          <Route path="/hiring-org/assessment-invite" element={<ProtectedRoute><AssessmentInvite /></ProtectedRoute>} />
          <Route path="/hiring-org/assessment" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
          <Route path="/hiring-org/invites" element={<ProtectedRoute><Invite /></ProtectedRoute>} />
          <Route path="/hiring-org/responses" element={<ProtectedRoute><Response /></ProtectedRoute>} />
          <Route path="/hiring-org/emailverify" element={<EmailVerify />} />        
          <Route path="/hiring-org/forgot-password" element={<ForgotPassword />} />  
          <Route path="/hiring-org/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />  
           <Route path="/hiring-org/admin/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />  
          <Route path="/unauthorized" element={<NoAccess/>} />  
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
