import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import LoginCustomer from "./pages/LoginCustomer";
import Products from "./pages/Products";
import Services from "./pages/Services";
import Blogs from "./pages/Blogs";
import Jobs from "./pages/Jobs";
import Contacts from "./pages/Contacts";
import CartPage from "./pages/CartPage";
import DashboardCustomer from "./pages/DashboardCustomer";
import IndexProvider from "./pages/provider/IndexProvider";
import LoginProvider from "./pages/provider/LoginProvider";
import DashboardProvider from "./pages/provider/DashboardProvider"
import AdminLogin from "./pages/admin/AdminLogin";

import AdminDashboard from "./pages/admin/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (


  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginCustomer />} />
          <Route path="/products" element={<Products />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/cartpage" element={<CartPage />} />
          <Route path="/customer/profile" element={<DashboardCustomer />} />

          <Route path="/provider/" element={<IndexProvider />} />
          <Route path="/provider/login" element={<LoginProvider />} />
          <Route path="/provider/dashboard" element={<DashboardProvider />} />

           <Route path="/admin" element={<AdminLogin />} />
           <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>

      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>

);





export default App;
