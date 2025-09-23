import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./components/ProtectdRoutes";
import { Products, Services, Blogs, Jobs, Contacts, AboutUs,Orders,Carts ,ChatBox} from "./pages/customer";
import { DashboardProvider, ProductStuffs, ServicesAndOrders, JobsAndRequests } from "./pages/provider";
import { AdminDashboard, ServicesManage, BlogsManage, CustomersManage, ProvidersManage, ProductsManage, JobsManage } from "@/pages/admin";


import Index from "./pages/Index";
import LoginCustomer from "./pages/LoginCustomer";
import ForgotPassword from "./pages/ForgotPassword";
import { AuthUser } from "./contexts/AuthContext";
import AdminLayout from "./components/layouts/AdminLayout";
import OrderPage from "./pages/admin/OrderPage";
import ProviderLayout from "./components/layouts/ProviderLayout";
import ProviderDashboard from "./pages/provider/DashboardProvider"
import OnGoing from "./pages/provider/OnGoing";
import MessagePro from "./pages/provider/MessagePro";
import ReviewPage from "./pages/admin/Review";
import QAPage from "./pages/admin/Question_forum";
import TransactionPage from "./pages/admin/Transaction";
import NotificationPage from "./pages/admin/Notification";
import PaymentHistory from "./pages/provider/PaymentHistory";
import QAProviderPage from "./pages/provider/QAProvider";
import PageNotFound from "./pages/PageNotFound";
import Chat from "./pages/provider/Chat";

// import AdminDashboard from "./pages/admin/AdminDashboard";
// import Message from "./pages/customer/Messsage";
// import Orders from "./pages/customer/Orders";
// import CartPage from "./pages/customer/CartPage";
// import DashboardCustomer from "./pages/DashboardCustomer";
// import IndexProvider from "./pages/provider/IndexProvider";
// import LoginProvider from "./pages/provider/LoginProvider";
// import DashboardProvider from "./pages/provider/DashboardProvider"
// import AdminLogin from "./pages/admin/AdminLogin";
// import Products from "./pages/customer/Products";
// import Services from "./pages/customer/Services";
// import Blogs from "./pages/customer/Blogs";
// import Jobs from "./pages/customer/Jobs";
// import Contacts from "./pages/customer/Contacts";
// import ProvidersPage from "./pages/admin/ProvidersPage";
// import ServicesPage from "./pages/admin/ServicesPage";
// import ProductsPage from "./pages/admin/ProductsPage";
// import UsersPage from "./pages/admin/UsersPage";
// import JobsAndRequests from "./pages/provider2/JobsAndRequests";
// //import ProductProvider from "./pages/provider2/Products";
// import ServiceProvider from "./pages/provider2/Services";
// import AboutUs from "./pages/customer/AboutUs";
// import PageNotFound from "./pages/PageNotFound";
// import Service_Request from "./pages/provider2/Service_Request";
// import Chat from "./pages/provider2/Chat";
// import Orders from "./pages/Orders";
// import ProjectOrder from "./pages/provider2/ProjectOrder";
// import ServicesAndOrders from "./pages/provider2/ServicesAndOrders";
// import JobRequest from "./pages/provider2/JobRequest";
// import Message from "./pages/Message";
// import ProductsAndOrders  from "./pages/provider2/Productsnew";
// import ProductStuffs from "./pages/provider2/ProductStuffs";
// import Products from "./pages/customer/Products";
// import CustomersPage from "./pages/admin/customerPage";
// import ProviderPage from "./pages/admin/providerPage";
// import ProductPage from "./pages/admin/productPage";
// import ServicesPage1 from "./pages/admin/ServicePage1";
// import JobsPage from "./pages/admin/JobOpenings";
// import BlogPage from "./pages/admin/Blogs";



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
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            <Route path="/products" element={<Products />} />
            <Route path="/services" element={<Services />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/cartpage" element={<Carts />} />
            {/* <Route path="/customer/profile" element={<DashboardCustomer />} /> */}
            <Route path="/orders" element={<Orders />} />
            <Route path="/message" element={<ChatBox />} />        
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
                      <Route path="user" element={<CustomersManage />} />
                      <Route path="provider" element={<ProvidersManage />} />
                      <Route path="products" element={<ProductsManage />} />
                      <Route path="service" element={<ServicesManage />} />
                      <Route path="jobs" element={<JobsManage />} />
                      <Route path="blogs" element={<BlogsManage />} />

                      {/* <Route path="provider" element={<ProvidersPage />} /> */}
                      {/* <Route path="product" element={<ProductsPage />} /> */}
                      {/* <Route path="service" element={<ServicesPage />} /> */}

                      {/* <Route path="user" element={<UsersPage />} /> */}
                      <Route path="order" element={<OrderPage />} />
                      <Route path="reviews" element={<ReviewPage />} />
                      <Route path="questions" element={<QAPage />} />
                      <Route path="transactions" element={<TransactionPage />} />
                      <Route path="notifications" element={<NotificationPage />} />


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
                      <Route path="/product_order" element={<ProductStuffs />} />
                      <Route path="/service_order" element={<ServicesAndOrders />} />
                      <Route path="/job_request" element={<JobsAndRequests />} />
                      <Route path="/chat" element={<Chat />} />
                      <Route path="/MessagePro" element={<MessagePro />} />
                      {/* <Route path="/product_order" element={<ProductsAndOrders />} /> */}


                      <Route path="/payment" element={<PaymentHistory />} />
                      <Route path="/qa" element={<QAProviderPage />} />

                      <Route path="/OnGoing_projects" element={<OnGoing />} />
                      {/* <Route path="/JobRequest" element={<JobRequest />} /> */}

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
