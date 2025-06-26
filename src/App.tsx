import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import LoginCustomer from "./pages/LoginCustomer";
import Products from "./pages/Products";
import Services from "./pages/Services";
import Blogs from "./pages/Blogs";
import Jobs from "./pages/Jobs";
import Contacts from "./pages/Contacts";
const App = () => (

  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<LoginCustomer/>} />
      <Route path="/products" element={<Products/>} />
      <Route path="/services" element={<Services/>} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/contacts" element={<Contacts />} />
    </Routes>

  </BrowserRouter>

);





export default App;
