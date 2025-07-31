import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./components/ProtectdRoutes";
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

import { AuthUser } from "./contexts/AuthContext";

import AdminLayout from "./components/layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProvidersPage from "./pages/admin/ProvidersPage";
import ServicesPage from "./pages/admin/ServicesPage";
import ProductsPage from "./pages/admin/ProductsPage";
import UsersPage from "./pages/admin/UsersPage";
import OrderPage from "./pages/admin/OrderPage";

import ProviderLayout from "./components/layouts/ProviderLayout";
import ProviderDashboard from "./pages/provider2/DashboardProvider"
import JobProvider from "./pages/provider2/Jobs";
import ProductProvider from "./pages/provider2/Products";
import ServiceProvider from "./pages/provider2/Services";
import AboutUs from "./pages/AboutUs";
import PageNotFound from "./pages/PageNotFound";
import Service_Request from "./pages/provider2/Service_Request";
import Chat from "./pages/provider2/Chat";
import Orders from "./pages/Orders";
import ProjectOrder from "./pages/provider2/ProjectOrder";
import ProductOrder from "./pages/provider2/ProductOrder";
import OnGoing from "./pages/provider2/OnGoing";

const queryClient = new QueryClient();

const App = () => (


  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <AuthUser>
        <BrowserRouter>
          <Routes>
            <Route path="/customer/dashboard" element={<Navigate to="/" replace />} />

            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginCustomer />} />
            <Route path="/products" element={<Products />} />
            <Route path="/services" element={<Services />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/cartpage" element={<CartPage />} />
            <Route path="/customer/profile" element={<DashboardCustomer />} />
            <Route path="/orders" element={<Orders />} />

            {/* <ProtectedRoute allowedRoles={['admin']}>
      <AdminLayout>
        {/* <Routes> */}
            {/* <Route path="dashboard" element={<DashboardPage />} /> */}
            {/* <Route path="users" element={<UsersPage />} /> */}
            {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
            {/* <Route path="/admin/provider" element={<ProvidersPage />} /> */}
            {/* <Route path="/admin/product" element={<ProductsPage />} /> */}
            {/* <Route path="/admin/service" element={<ServicesPage />} /> */}
            {/* <Route path="/admin/user" element={<UsersPage />} />  */}
             <Route path="*" element={<PageNotFound />} />

            ...
            {/* </Routes> */}
            {/* </AdminLayout> */}
            {/* </ProtectedRoute> */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout>


                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="provider" element={<ProvidersPage />} />
                      <Route path="product" element={<ProductsPage />} />
                      <Route path="service" element={<ServicesPage />} />
                      <Route path="user" element={<UsersPage />} />
                      <Route path="order" element={<OrderPage />} />

                      <Route path="" element={<Navigate to="dashboard" replace />} />

                    </Routes>
                    {/* </Route> */}
                  </AdminLayout>
                </ProtectedRoute>} />



            {/* <Route path="/admin" element={<AdminLogin />} />

            <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/provider" element={<AdminLayout><ProvidersPage /></AdminLayout>} />
          <Route path="/admin/product" element={<AdminLayout><ProductsPage /></AdminLayout>} />
          <Route path="/admin/service" element={<AdminLayout><ServicesPage /></AdminLayout>} />
          <Route path="/admin/user" element={<AdminLayout><UsersPage /></AdminLayout>} /> */}

            {/* <Route path="/provider/" element={<IndexProvider />} /> */}
            {/* <Route path="/provider/login" element={<LoginProvider />} /> */}
            <Route
              path="/service_provider/*"
              element={
                <ProtectedRoute allowedRoles={['service_provider']}>
                  <ProviderLayout>


                    <Routes>
                      <Route path="/dashboard" element={<ProviderDashboard />} />
                      <Route path="/job" element={<JobProvider />} />
                      <Route path="/product" element={<ProductProvider />} />
                      <Route path="/service" element={<ServiceProvider />} />
                      <Route path="/service_req" element={<Service_Request />} />
                      <Route path="/project_order" element={<ProjectOrder />} />
                      <Route path="/product_order" element={<ProductOrder />} />
                      <Route path="/chat" element={<Chat />} />
                      <Route path="/OnGoing_projects" element={<OnGoing />} />
                      <Route path="" element={<Navigate to="dashboard" replace />} />

                      {/* <Route path="/provider/" element={<Dashboard />} /> */}
                    </Routes>

                    {/* </Route> */}
                  </ProviderLayout>
                </ProtectedRoute>} />

                </Routes>

        </BrowserRouter>
      </AuthUser>
    </TooltipProvider>
  </QueryClientProvider>

);





export default App;
