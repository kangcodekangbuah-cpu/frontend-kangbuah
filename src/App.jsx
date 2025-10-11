// App.jsx
import { Routes, Route } from "react-router-dom"
import HomePage from "../src/pages/home/HomePage"
import LoginPage from "../src/pages/login/LoginPage"
import RegisterPage from "../src/pages/register/RegisterPage"
import CatalogPage from "../src/pages/catalog/CatalogPage"

export default function App() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<HomePage />} />

      {/* Auth Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/catalog" element={<CatalogPage />} />
    </Routes>
  )
}
