// App.jsx
import { Routes, Route } from "react-router-dom"
import { useState, useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useAuthStore } from './store/authStore';
import apiClient from './services/api';
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
import LoadingSpinner from "./components/ui/Layout/LoadingSpinner";

function App() {

  const [isInitialized, setIsInitialized] = useState(false);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setToken = useAuthStore((state) => state.setToken);

  const isInitializing = useRef(false);

  useEffect(() => {

    if (isInitializing.current) {
      return;
    }

    isInitializing.current = true;
    const initializeApp = async () => {

      try {

        const res = await apiClient.get('/auth/refresh');

        if (res.data.data.accessToken) {
          setToken(res.data.data.accessToken);
        } else {
          throw new Error("Invalid refresh response");
        }
      } catch (error) {
        clearAuth();
      } finally {
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, [setToken, clearAuth]);

  if (!isInitialized) {
    return <LoadingSpinner text="Memuat..." />;
  }

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
        position="top-center"
        autoClose={2000}
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
  );
}

export default App;