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

import AdminLayout from "./components/layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProvidersPage from "./pages/admin/ProvidersPage";
import ServicesPage from "./pages/admin/ServicesPage";
import ProductsPage from "./pages/admin/ProductsPage";
import UsersPage from "./pages/admin/UsersPage";

import ProviderLayout from "./components/layouts/ProviderLayout";
import ProviderDashboard from "./pages/provider2/DashboardProvider"
import JobProvider from "./pages/provider2/Jobs";
import ProductProvider from "./pages/provider2/Products";
import ServiceProvider from "./pages/provider2/Services";

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
       
           <Route path="/admin" element={<AdminLogin />} />

            <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/provider" element={<AdminLayout><ProvidersPage /></AdminLayout>} />
          <Route path="/admin/product" element={<AdminLayout><ProductsPage /></AdminLayout>} />
          <Route path="/admin/service" element={<AdminLayout><ServicesPage /></AdminLayout>} />
          <Route path="/admin/user" element={<AdminLayout><UsersPage /></AdminLayout>} />

          <Route path="/provider/" element={<IndexProvider />} />
          <Route path="/provider/login" element={<LoginProvider />} />

          <Route path="/provider/dashboard" element={<ProviderLayout> <ProviderDashboard/></ProviderLayout>} />
          <Route path="/provider/job" element={<ProviderLayout> <JobProvider/></ProviderLayout>} />
          <Route path="/provider/product" element={<ProviderLayout> <ProductProvider/></ProviderLayout>} />
          <Route path="/provider/service" element={<ProviderLayout> <ServiceProvider/></ProviderLayout>} />
          {/* <Route path="/provider/" element={<Dashboard />} /> */}
           </Routes>

           

      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>

);





export default App;
