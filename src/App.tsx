import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import LoginCustomer from "./pages/LoginCustomer";
const App = () => (

  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<LoginCustomer/>} />
    </Routes>

  </BrowserRouter>

);





export default App;
