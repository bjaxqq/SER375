import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ScrollToTop from "./utils/ScrollToTop"
import Browse from "./pages/Browse"
import Product from "./pages/Product"
import Login from "./pages/Login"
import Cart from "./pages/Cart"
import EnhancedMainLayout from "./components/EnhancedMainLayout"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<EnhancedMainLayout />}>
          <Route index element={<Browse />}></Route>
          <Route path="/product/:id" element={<Product />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/cart" element={<Cart />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
