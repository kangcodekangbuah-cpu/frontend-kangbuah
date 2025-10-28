// App.jsx
import { Routes, Route } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from "../src/pages/home/HomePage"
import LoginPage from "../src/pages/login/LoginPage"
import RegisterPage from "../src/pages/register/RegisterPage"
import CatalogPage from "../src/pages/catalog/CatalogPage"
import OrderPage from "../src/pages/order/page"
import OrderHistoryPage from "../src/pages/order-history/page"
import PaymentPage from "../src/pages/payment/page"
import AdminCatalogPage from "./pages/admin/adminCatalog/AdminCatalogPage";
import AdminChat from "./pages/admin/adminChat/AdminChat";
import AdminOrders from "./pages/admin/adminOrders/AdminOrders";

export default function App() {
  return (
    <>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<HomePage />} />

        {/* Auth Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/order-history" element={<OrderHistoryPage />} />
        <Route path="/payment/:orderId" element={<PaymentPage />} />
        <Route path="/admin/catalog" element={<AdminCatalogPage />} />
        <Route path="/admin/chat" element={<AdminChat />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}
