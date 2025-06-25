import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
const App = () => (

  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
    </Routes>

  </BrowserRouter>

);





export default App;
